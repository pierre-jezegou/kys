"use client";

import Image from "next/image";

import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Select } from "@/components/catalyst/select";
import { Text } from "@/components/catalyst/text";
import Spinner from "@/components/spinner";
import { createSession } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const universities = [
  "Universitat Politècnica de Catalunya",
  "Danmarks Tekniske Universitet",
  "École Centrale de Lille",
];

export default function CheckoutForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setLoading(true);

      try {
        const sessionId = await createSession(
          `${firstName} ${lastName}`,
          university
        );
        router.push(`/verify/start/${sessionId}`);
      } finally {
        setLoading(false);
      }
    },
    [firstName, lastName, university, router, setLoading]
  );

  return (
    <div className="bg-white">
      {/* Background color split screen for large screens */}
      <div
        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <dl>
              <dt className="text-sm font-medium">Amount due</dt>
              <dd className="mt-1 text-3xl font-bold tracking-tight text-white">
                €37.00
              </dd>
            </dl>

            <ul
              role="list"
              className="divide-y divide-white divide-opacity-10 text-sm font-medium"
            >
              <li className="flex items-start space-x-4 py-6">
                <Image
                  src="/product.jpeg"
                  alt="Glass bottle with black plastic pour top and mesh insert."
                  height="80"
                  width="80"
                  className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
                />
                <div className="flex-auto space-y-1">
                  <h3 className="text-white">Cold Brew Bottle</h3>
                  <p>Glass bottle with a mesh insert</p>
                </div>
                <p className="flex-none text-base font-medium text-white">
                  €32.00
                </p>
              </li>
            </ul>

            <dl className="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>€32.0</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd>€5.00</dd>
              </div>

              <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                <dt className="text-base">Total</dt>
                <dd className="text-base">€37.00</dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            Student discount
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <Fieldset>
                <Legend>Student discount</Legend>
                <Text>
                  We need to know a little bit more about you to apply the
                  student discount.
                </Text>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                    <Field>
                      <Label>First name</Label>
                      <Input
                        name="first_name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label>Last name</Label>
                      <Input
                        name="last_name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </Field>
                  </div>
                  <Field>
                    <Label>Univeristy</Label>
                    <Select
                      name="univeristy"
                      onChange={(e) => setUniversity(e.target.value)}
                    >
                      <option value="">Select a university</option>
                      {universities.map((university) => (
                        <option key={university}>{university}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field className="flex justify-end border-t border-gray-200 pt-6">
                    <button
                      type="submit"
                      disabled={
                        !firstName || !lastName || !university || loading
                      }
                      className="flex rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <Spinner /> : null}
                      Verify me!
                    </button>
                  </Field>
                </FieldGroup>
              </Fieldset>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
