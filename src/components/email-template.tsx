import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Your email: {email}</p>
      <p>Your message: {message}</p>
    </div>
  );
}