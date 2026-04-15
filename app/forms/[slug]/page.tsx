import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/server";
import DynamicForm from "@/components/DynamicForm";
import type { FormField } from "@/components/DynamicForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

interface FormRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  success_message: string;
  is_active: boolean;
}

async function fetchForm(slug: string): Promise<{ form: FormRow; fields: FormField[] } | null> {
  try {
    const admin = createAdminClient();
    const { data: form, error: formError } = await admin
      .from("forms")
      .select("id, name, slug, description, success_message, is_active")
      .eq("slug", slug)
      .single();

    if (formError || !form || !form.is_active) return null;

    const { data: fields, error: fieldsError } = await admin
      .from("form_fields")
      .select("*")
      .eq("form_id", form.id)
      .order("sort_order")
      .order("created_at");

    if (fieldsError) return null;

    return { form: form as FormRow, fields: (fields ?? []) as FormField[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchForm(slug);
  if (!result) return {};
  return {
    title: `${result.form.name} | SAE Academy`,
    description: result.form.description ?? undefined,
  };
}

export default async function FormPage({ params }: Props) {
  const { slug } = await params;
  const result = await fetchForm(slug);
  if (!result) notFound();

  const { form, fields } = result;

  return (
    <>
      {/* Header */}
      <section className="relative bg-[#0d0d0d] pt-32 pb-14 px-5 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-[#C9A84C]" />
        <div className="max-w-2xl mx-auto">
          <p className="text-[#C9A84C] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            SAE Academy
          </p>
          <h1 className="font-black text-4xl sm:text-5xl uppercase text-white leading-none">
            {form.name}
          </h1>
          {form.description && (
            <p className="text-gray-400 text-base leading-relaxed mt-5 max-w-xl">
              {form.description}
            </p>
          )}
        </div>
      </section>

      {/* Form */}
      <section className="bg-[#0f0f0f] py-12 px-5">
        <div className="max-w-2xl mx-auto">
          {fields.length === 0 ? (
            <p className="text-gray-600 text-sm uppercase tracking-wider text-center py-16">
              This form has no fields yet.
            </p>
          ) : (
            <DynamicForm
              formId={form.id}
              fields={fields}
              successMessage={form.success_message}
            />
          )}
        </div>
      </section>
    </>
  );
}
