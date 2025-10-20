import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // Esperamos a que los parámetros lleguen
  const params = await props.params;
  const id = params.id;

  // Usamos Promise.all para obtener tanto la factura como los clientes en paralelo
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id), // Buscar la factura por ID
    fetchCustomers(),      // Obtener la lista de clientes
  ]);

  // Si la factura no se encuentra, invocamos notFound() para mostrar la página 404
  if (!invoice) {
    notFound();
  }

  return (
    <main>
      {/* Componente de Breadcrumbs para la navegación */}
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* Formulario de edición de factura */}
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}