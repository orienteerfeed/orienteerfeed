import { DatabaseError, ValidationError } from '../../exceptions/index.js';
import prisma from '../../utils/context.js';
import { decrypt, decodeBase64 } from '../../utils/cryptoUtils.js';

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

  return 'Competitor status has been successfully changed';
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
  card,
  note,
  userId,
) => {
  let dbResponseCompetitor;
  try {
    dbResponseCompetitor = await prisma.competitor.findFirst({
      where: { id: parseInt(competitorId) },
      select: {
        id: true,
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

  let change_type = 'competitor_update';
  if (origin === 'START') {
    //TODO: implement logic, to check if is it possible to make status change, what if the competitor has status NotCompeting??
    change_type = 'si_card_change';
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
  try {
    await prisma.competitor.update({
      where: { id: parseInt(competitorId) },
      data: { card: card, note: note },
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
        competitorId: parseInt(competitorId),
        origin: origin,
        type: change_type,
        previousValue: dbResponseCompetitor.card.toString(),
        newValue: card.toString(),
        authorId: userId,
      },
    });
  } catch (err) {
    console.error('Failed to update competitor:', err);
    throw new DatabaseError('Error creating protocol record');
  }

  return 'Competitor has been successfully updated';
};
