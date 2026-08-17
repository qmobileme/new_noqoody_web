UPDATE public.email_settings
SET from_email = 'no-reply@sub.noqoody.com',
    from_name = 'No Reply',
    reply_to = 'no-reply@sub.noqoody.com',
    notification_recipient = COALESCE(NULLIF(notification_recipient,''), 'info@noqoody.com')
WHERE id = true;