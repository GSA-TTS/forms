interface AttachmentFileTypeOption {
  label: string;
  value: string;
}

export const attachmentFileTypeOptions: AttachmentFileTypeOption[] = [
  {
    label: 'JPG',
    value: 'image/jpeg',
  },
  {
    label: 'PDF',
    value: 'application/pdf',
  },
  {
    label: 'PNG',
    value: 'image/png',
  },
];

export const attachmentFileTypeMimes = attachmentFileTypeOptions.map(
  item => item.value
);
