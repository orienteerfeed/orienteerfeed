import React, { useState } from 'react';
import { DragDropContainer } from '../molecules';
import { useRequest, toast } from '../utils';
import { useTranslation } from 'react-i18next';
import ENDPOINTS from '../endpoints';
export const DragDropFile = ({ eventId }) => {
  const [ownerLicense, setOwnerLicense] = useState([]);
  const request = useRequest();
  const { t } = useTranslation();
  const uploadFiles = (f) => {
    console.log('uploading');
    setOwnerLicense([...ownerLicense, ...f]);
    // Create a new FormData object to handle file uploads
    const formData = new FormData();

    // Append eventId to the FormData
    formData.append('eventId', eventId);

    // Append each file to the FormData object
    f.forEach((file) => {
      formData.append('file', file.blob, file.name);
    });

    // Send the files and eventId using the request.request function
    request.request(ENDPOINTS.uploadIofXml(), {
      method: 'POST',
      body: formData, // FormData object containing eventId and file(s)
      onSuccess: (response) => {
        // Handle successful upload
        console.log('Files uploaded successfully:', response);

        // Optional success notification
        toast({
          title: t('Operations.Success', { ns: 'common' }),
          description: t('Organisms.DragDrop.Toast.UploadSuccess'),
          variant: 'success',
        });

        setOwnerLicense([]);
        console.log('Files uploaded and drag-drop area cleared.');
      },
      onError: (err) => {
        // Handle errors
        console.error('Error uploading files:', err);

        toast({
          title: t('UploadFail', { ns: 'common' }),
          description: t('Organisms.DragDrop.Toast.UploadFail'),
          variant: 'destructive',
        });
      },
    });
  };

  const deleteFile = (indexImg) => {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexImg);
    setOwnerLicense(updatedList);
  };
  return (
    <div className="w-full">
      <div className="pb-2 border-b border-input">
        <h2 className="text-black dark:text-white font-semibold">
          {t('Organisms.DragDrop.UploadIofXml.Title')}
        </h2>
      </div>
      <DragDropContainer
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={2}
        formats={['xml']}
      />
    </div>
  );
};
