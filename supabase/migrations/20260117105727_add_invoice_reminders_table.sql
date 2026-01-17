create table public.invoice_reminders (
  id uuid primary key default gen_random_uuid(),

  invoice_id bigint not null
    references public.invoices(id)
    on delete cascade,

  channel text not null default 'email',

  status text not null
    check (status in ('sent', 'failed')),

  error text,

  sent_at timestamptz not null default now()
);

create index idx_invoice_reminders_invoice_id
  on public.invoice_reminders (invoice_id);

create index idx_invoice_reminders_sent_at
  on public.invoice_reminders (sent_at);

alter table public.invoice_reminders
enable row level security;

create policy "Admin full access on invoice_reminders"
on public.invoice_reminders
for all
using (auth.uid() = '6f12ebcf-23f1-4b55-a71c-a2e9e2e7665c')
with check (auth.uid() = '6f12ebcf-23f1-4b55-a71c-a2e9e2e7665c');