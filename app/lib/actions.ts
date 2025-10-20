'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Esquema de validación para los datos del formulario
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// El esquema para crear una factura (sin incluir id ni date)
const CreateInvoice = FormSchema.omit({ id: true, date: true });
// El esquema para actualizar una factura (sin incluir id ni date)
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Acción para crear una factura
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Acción para actualizar una factura
export async function updateInvoice(id: string, formData: FormData) {
  // Parseamos y validamos los datos del formulario
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Convertimos la cantidad a centavos
  const amountInCents = amount * 100;

  // Actualizamos la factura en la base de datos
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  // Revalidamos la ruta y redirigimos a la página de facturas
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Acción para eliminar una factura
export async function deleteInvoice(id: string) {
  // Eliminamos la factura de la base de datos
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  
  // Revalidamos la ruta y actualizamos la vista
  revalidatePath('/dashboard/invoices');
}
