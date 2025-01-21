import { useCallback, useRef, useEffect, useState } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';

import { toast } from '../utils';

export const DragDropContainer = ({
  ownerLicense,
  onUpload,
  onDelete,
  count,
  formats,
}) => {
  const dropContainer = useRef(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);
  const { t } = useTranslation();

  // Handles both drag-and-drop and file input
  const handleDrop = useCallback(
    (e, type) => {
      let files;
      if (type === 'inputFile') {
        files = [...e.target.files];
      } else {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        files = [...e.dataTransfer.files];
      }

      // Validate file formats
      const allFilesValid = files.every((file) => {
        return formats.some((format) => file.type.endsWith(`/${format}`));
      });

      // Check for maximum file count
      if (ownerLicense.length >= count) {
        toast({
          title: t('Molecules.DragDrop.Toast.MAximumFiles.Title'),
          description: t('Molecules.DragDrop.Toast.MaximumFiles.Description', {
            count,
          }),
          variant: 'warning',
        });
        return;
      }

      // Check if files have valid formats
      if (!allFilesValid) {
        toast({
          title: t('Molecules.DragDrop.Toast.InvalidFileFormat.Title'),
          description:
            t('Molecules.DragDrop.Toast.InvalidFileFormat.Description') +
            ` ${formats.join(', ').toUpperCase()}`,
          variant: 'warning',
        });
        return;
      }

      // Check if the count of selected files exceeds the limit
      if (count && count < files.length) {
        toast({
          title: t('ErrorMessage', { ns: 'common' }),
          description:
            count !== 1
              ? t('Molecules.DragDrop.Toast.Error.DescriptionPlural', { count })
              : t('Molecules.DragDrop.Toast.Error.DescriptionSingle', {
                  count,
                }),
          variant: 'destructive',
        });
        return;
      }

      if (files && files.length) {
        const nFiles = files.map(async (file) => {
          const base64String = await convertFileBase64(file);
          return {
            name: file.name,
            data: base64String,
            type: file.type,
            size: file.size,
            blob: new Blob([file], { type: file.type }),
          };
        });

        Promise.all(nFiles).then((newFiles) => {
          onUpload(newFiles);
          // Clear file input to allow new file upload
          fileRef.current.value = null;
        });
      }
    },
    [formats, ownerLicense, count, onUpload, t], // Memoize to avoid re-creating it on each render
  );

  // Convert file to base64
  async function convertFileBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(() => {
    const dropNode = dropContainer.current;

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
    };

    const dropHandler = (e) => handleDrop(e, 'drop'); // Memoize drop handler

    if (dropNode) {
      dropNode.addEventListener('dragover', handleDragOver);
      dropNode.addEventListener('drop', dropHandler);
      dropNode.addEventListener('dragleave', handleDragLeave);
    }

    return () => {
      if (dropNode) {
        dropNode.removeEventListener('dragover', handleDragOver);
        dropNode.removeEventListener('drop', dropHandler);
        dropNode.removeEventListener('dragleave', handleDragLeave);
      }
    };
  }, [handleDrop]); // Depend only on handleDrop to prevent multiple listeners

  return (
    <>
      {/* Container Drop */}
      <div
        className={`${
          dragging
            ? 'border border-[#2B92EC] bg-[#EDF2FF]'
            : 'border-dashed border-[#e0e0e0]'
        } flex items-center justify-center mx-auto text-center border-2 rounded-md mt-4 py-5`}
        ref={dropContainer}
      >
        <div className="flex-1 flex flex-col">
          <div className="mx-auto text-gray-400 mb-2">
            <AiOutlineUpload size={18} />
          </div>
          <div className="text-[12px] font-normal text-gray-500">
            <input
              className="opacity-0 hidden"
              type="file"
              multiple
              accept="text/xml,application/xml"
              ref={fileRef}
              onChange={(e) => handleDrop(e, 'inputFile')}
            />
            <span
              className="text-[#4070f4] cursor-pointer"
              onClick={() => {
                fileRef.current.click();
              }}
            >
              {t('Molecules.DragDrop.ClickToUpload')}
            </span>{' '}
            {t('Molecules.DragDrop.OrdDragAndDrop')}
          </div>
          <div className="text-[10px] font-normal text-gray-500">
            {t('Molecules.DragDrop.SupportedFormats')}{' '}
            {formats.join(', ').toUpperCase()}
          </div>
        </div>
      </div>

      {ownerLicense.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-y-4 gap-x-4">
          {ownerLicense.map((img, index) => (
            <div
              key={index} // Add key to prevent React warnings
              className="w-full px-3 py-3.5 rounded-md bg-slate-200 space-y-3"
            >
              <div className="flex justify-between">
                <div className="w-[70%] flex justify-start items-center space-x-2">
                  <div className="text-[#5E62FF] text-[37px] cursor-pointer">
                    {img.type.match(/image.*/i) ? 'image' : 'file'}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500">
                      {img.name}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      {`${Math.floor(img.size / 1024)} KB`}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex justify-end">
                  <div className="space-y-1">
                    <div
                      className="text-gray-500 text-[17px] cursor-pointer"
                      onClick={() => onDelete(index)}
                    >
                      &#x2715;
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      {t('Molecules.DragDrop.Done')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
