import { DatabaseError, ValidationError } from '../../exceptions/index.js';
import prisma from '../../utils/context.js';
import { decrypt, decodeBase64 } from '../../utils/cryptoUtils.js';
import { createShortCompetitorHash } from '../../utils/hashUtils.js';
import { publishUpdatedCompetitors } from '../../utils/subscriptionUtils.js';

export const changeCompetitorStatus = async (
  eventId,
  competitorId,
  origin,
  status,
  userId,
) => {
  let dbResponseCompetitor;
  try {
    dbResponseCompetitor = await prisma.competitor.findFirst({
      where: { id: competitorId },
      select: {
        id: true,
        classId: true,
        status: true,
        card: true,
      },
    });
  } catch (err) {
    console.error(err);
    throw new DatabaseError(`An error occurred: ` + err.message);
  }

  if (!dbResponseCompetitor) {
    throw new ValidationError(
      `Competitor with ID ${competitorId} does not exist in the database` +
        err.message,
    );
  }

  // Initialize competitorStatus to the provided status, and lateStart to false.
  // These variables will be adjusted based on the origin and other conditions later.
  let competitorStatus = status;
  let lateStart = false;
  if (origin === 'START') {
    //TODO: implement logic, to check if is it possible to make status change, what if the competitor has status NotCompeting??
    // It is forbidden to change the status of the runner after they have finished.
    if (
      !['Inactive', 'DidNotStart', 'Active'].includes(
        dbResponseCompetitor.status,
      )
    ) {
      throw new ValidationError(
        `Could not change status of runner that has already finished`,
      );
    }
    // If the new status is 'LateStart', update the status to 'Active' and set lateStart to true.
    if (status === 'LateStart') {
      competitorStatus = 'Active';
      lateStart = true;
    }
  }
  try {
    await prisma.competitor.update({
      where: { id: parseInt(competitorId) },
      data: { status: competitorStatus, lateStart: lateStart },
    });
  } catch (err) {
    console.error('Failed to update competitor:', err);
    throw new DatabaseError('Error updating competitor');
  }

  // Add record to protocol
  try {
    await prisma.protocol.create({
      data: {
        eventId: eventId,
        competitorId: competitorId,
        origin: origin,
        type: 'status_change',
        previousValue: dbResponseCompetitor.status,
        newValue: competitorStatus,
        authorId: userId,
      },
    });
  } catch (err) {
    console.error('Failed to update competitor:', err);
    throw new DatabaseError('Error creating protocol record');
  }

  // Publish changes to subscribers
  try {
    await publishUpdatedCompetitors(dbResponseCompetitor.classId);
  } catch (err) {
    console.error('Error publishing competitors update:', err);
  }

  return `Competitor's status has been successfully changed to ${competitorStatus}`;
};

/**
 * Retrieves the event details and decrypts the event password if it exists and is not expired.
 *
 * @param {string} eventId - The ID of the event.
 * @returns {string|undefined} The decrypted event password if found and not expired, otherwise undefined.
 * @throws {ValidationError} If the event is not found or the user does not have permissions.
 * @throws {Error} If Prisma query fails or decryption encounters an error.
 */
export const getDecryptedEventPassword = async (eventId) => {
  try {
    // Fetch the event based on eventId
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        authorId: true,
        // Add any other fields you might want to fetch
      },
    });

    // Validate if the event exists and the current user has permission
    if (!event) {
      throw new ValidationError(
        'Event not found or you don’t have the permissions.',
      );
    }

    // Fetch the event password if available
    const eventPassword = await prisma.eventPassword.findUnique({
      where: { eventId: eventId },
      select: {
        id: true,
        password: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!eventPassword) return;

    // Check if eventPassword is found and is not expired
    const decryptedPassword =
      eventPassword && new Date(eventPassword.expiresAt) > new Date()
        ? decrypt(decodeBase64(eventPassword.password)) // Decrypt the password if valid
        : undefined;
    if (!decryptedPassword) return; // return null if password is expired
    return { ...eventPassword, password: decryptedPassword }; // Return the decrypted password or undefined
  } catch (error) {
    console.error('Error fetching event or event password:', error);

    // Prisma specific error handling
    if (error) {
      throw new DatabaseError('Unknown database error occurred.');
    } else {
      // Handle all other general errors
      throw new Error('Failed to retrieve or decrypt the event password.');
    }
  }
};

export const updateCompetitor = async (
  eventId,
  competitorId,
  origin,
  updateData,
  userId,
) => {
  let dbResponseCompetitor;
  try {
    dbResponseCompetitor = await prisma.competitor.findFirst({
      where: { id: parseInt(competitorId) },
      select: {
        id: true,
        classId: true,
        status: true,
        card: true,
        note: true,
      },
    });
  } catch (err) {
    console.error(err);
    throw new DatabaseError(`An error occurred: ` + err.message);
  }

  if (!dbResponseCompetitor) {
    throw new ValidationError(
      `Competitor with ID ${competitorId} does not exist in the database` +
        err.message,
    );
  }

  if (origin === 'START') {
    //TODO: implement logic, to check if is it possible to make status change, what if the competitor has status NotCompeting??
    // It is forbidden to change the state of the runner after he has finished
    if (
      !['Inactive', 'DidNotStart', 'Active'].includes(
        dbResponseCompetitor.status,
      )
    ) {
      throw new ValidationError(
        `Could not change status of runner that has already finished`,
      );
    }
  }

  // Collect changes to be added to the protocol
  const changes = [];

  // Define a mapping of updateData keys to their corresponding protocol types
  const keyToTypeMap = {
    card: 'si_card_change',
    note: 'note_change',
  };

  // Iterate over keys in updateData
  Object.keys(updateData).forEach((key) => {
    if (keyToTypeMap[key]) {
      changes.push({
        type: keyToTypeMap[key],
        previousValue: dbResponseCompetitor[key]?.toString() || null,
        newValue: updateData[key].toString(),
      });
    }
  });

  try {
    await prisma.competitor.update({
      where: { id: parseInt(competitorId) },
      data: { ...updateData },
    });
  } catch (err) {
    console.error('Failed to update competitor:', err);
    throw new DatabaseError('Error updating competitor');
  }

  // Add record to protocol
  try {
    for (const change of changes) {
      await prisma.protocol.create({
        data: {
          eventId: eventId,
          competitorId: parseInt(competitorId),
          origin: origin,
          type: change.type,
          previousValue: change.previousValue,
          newValue: change.newValue,
          authorId: userId,
        },
      });
    }
  } catch (err) {
    console.error('Failed to update competitor:', err);
    throw new DatabaseError('Error creating protocol record');
  }

  // Publish changes to subscribers
  try {
    await publishUpdatedCompetitors(dbResponseCompetitor.classId);
  } catch (err) {
    console.error('Error publishing competitors update:', err);
  }

  return {
    message: 'Competitor has been successfully updated',
    updatedFields: updateData,
  };
};

export const storeCompetitor = async (
  eventId,
  competitorData,
  userId,
  origin,
) => {
  const { classId, firstname, lastname, registration, status, card, note } =
    competitorData;

  // Check if the class exists before proceeding
  let existingClass;
  try {
    existingClass = await prisma.class.findUnique({
      where: { id: parseInt(classId) },
      select: { id: true },
    });
  } catch (err) {
    console.error('Database error:', err);
    throw new DatabaseError('Error retrieving class information.');
  }

  if (!existingClass) {
    throw new ValidationError(`Class with ID ${classId} does not exist.`);
  }

  let newCompetitor;
  try {
    newCompetitor = await prisma.competitor.create({
      data: {
        classId: parseInt(classId),
        firstname,
        lastname,
        nationality: competitorData.nationality || null,
        registration:
          registration ||
          createShortCompetitorHash(classId, lastname, firstname),
        license: competitorData.license || null,
        ranking: competitorData.ranking || null,
        organisation: competitorData.organisation || null,
        shortName: competitorData.shortName || null,
        card: card ? parseInt(card) : null,
        bibNumber: competitorData.bibNumber
          ? parseInt(competitorData.bibNumber)
          : null,
        startTime: competitorData.startTime
          ? new Date(competitorData.startTime)
          : null,
        finishTime: competitorData.finishTime
          ? new Date(competitorData.finishTime)
          : null,
        time: competitorData.time || null,
        status: status || 'Inactive', // Default to Inactive if not provided
        lateStart: competitorData.lateStart || false,
        note: note || null,
      },
    });
  } catch (err) {
    console.error('Error creating competitor:', err);
    throw new DatabaseError('Error storing competitor.');
  }

  // Add a protocol record for each changed field
  try {
    await prisma.protocol.create({
      data: {
        eventId: eventId,
        competitorId: newCompetitor.id,
        origin: origin,
        type: 'competitor_create',
        previousValue: null,
        newValue: lastname + ' ' + firstname,
        authorId: userId,
      },
    });
  } catch (err) {
    console.error('Error creating protocol record:', err);
    throw new DatabaseError('Error logging competitor creation in protocol.');
  }

  // Publish event updates
  try {
    await publishUpdatedCompetitors(newCompetitor.classId);
  } catch (err) {
    console.error('Error publishing competitors update:', err);
  }

  return {
    message: 'Competitor has been successfully created',
    competitor: newCompetitor,
  };
};

/**
 * Deletes all records from the protocol table for a given eventId
 * and removes all competitors associated with that eventId.
 *
 * @param {number} eventId - The ID of the event for which records should be deleted.
 * @throws {DatabaseError} If there is an error deleting records from the database.
 * @returns {string} Success message indicating the data has been deleted.
 */
export const deleteEventCompetitors = async (eventId) => {
  try {
    // Delete all protocol records for the given eventId
    await prisma.protocol.deleteMany({
      where: { eventId: eventId },
    });
  } catch (err) {
    console.error('Failed to delete protocol records:', err);
    throw new DatabaseError('Error deleting protocol records');
  }

  try {
    // Find all class IDs associated with the eventId
    const classIds = await prisma.class.findMany({
      where: { eventId: eventId },
      select: { id: true },
    });

    const classIdList = classIds.map((cls) => cls.id);

    // Delete all competitors associated with the found class IDs
    await prisma.competitor.deleteMany({
      where: { classId: { in: classIdList } },
    });
  } catch (err) {
    console.error('Failed to delete competitors:', err);
    throw new DatabaseError('Error deleting competitors');
  }

  return `All competitors for event ${eventId} have been successfully deleted.`;
};

/**
 * Deletes all records from the protocol table for a given eventId
 * and removes all competitors, classes, and event password associated with that eventId.
 *
 * @param {number} eventId - The ID of the event for which records should be deleted.
 * @throws {DatabaseError} If there is an error deleting records from the database.
 * @returns {string} Success message indicating the data has been deleted.
 */
export const deleteAllEventData = async (eventId) => {
  try {
    // Delete all protocol records for the given eventId
    await prisma.protocol.deleteMany({
      where: { eventId: eventId },
    });
  } catch (err) {
    console.error('Failed to delete protocol records:', err);
    throw new DatabaseError('Error deleting protocol records');
  }

  try {
    // Find all class IDs associated with the eventId
    const classIds = await prisma.class.findMany({
      where: { eventId: eventId },
      select: { id: true },
    });

    const classIdList = classIds.map((cls) => cls.id);

    // Delete all competitors associated with the found class IDs
    await prisma.competitor.deleteMany({
      where: { classId: { in: classIdList } },
    });

    // Delete all classes associated with the eventId
    await prisma.class.deleteMany({
      where: { eventId: eventId },
    });

    // Delete event password
    await prisma.eventPassword.deleteMany({
      where: { eventId: eventId },
    });
  } catch (err) {
    console.error('Failed to delete event-related data:', err);
    throw new DatabaseError('Error deleting event-related data');
  }

  return `All event data for event ${eventId} have been successfully deleted.`;
};
