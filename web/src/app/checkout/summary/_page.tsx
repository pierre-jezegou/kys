"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Summary() {
  const searchParams = useSearchParams();
  const discount = searchParams.get("discount");

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            It&apos;s on the way!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your order #14034056 has shipped and will be with you soon.
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Tracking number</dt>
            <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
          </dl>
        </div>

        <div className="mt-10 border-t border-gray-200">
          <h2 className="sr-only">Your order</h2>

          <h3 className="sr-only">Items</h3>

          <div className="flex space-x-6 border-b border-gray-200 py-10">
            <Image
              src="/product.jpeg"
              alt="Glass bottle with black plastic pour top and mesh insert."
              height="80"
              width="80"
              className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
            />
            <div className="flex flex-auto flex-col">
              <div>
                <h4 className="font-medium text-gray-900">
                  <a href="#">Cold Brew Bottle</a>
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  This glass bottle comes with a mesh insert for steeping tea or
                  cold-brewing coffee. Pour from any angle and remove the top
                  for easy cleaning.
                </p>
              </div>
              <div className="mt-6 flex flex-1 items-end">
                <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                  <div className="flex">
                    <dt className="font-medium text-gray-900">Quantity</dt>
                    <dd className="ml-2 text-gray-700">1</dd>
                  </div>
                  <div className="flex pl-4 sm:pl-6">
                    <dt className="font-medium text-gray-900">Price</dt>
                    <dd className="ml-2 text-gray-700">€32.00</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="sm:ml-40 sm:pl-6">
            <h4 className="sr-only">Payment</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Payment method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>Apple Pay</p>
                  <p>Mastercard</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>1545
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Shipping method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>DHL</p>
                  <p>Takes up to 3 working days</p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">€32.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex font-medium text-gray-900">
                  Discount
                  {discount ? (
                    <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                      STUDENT50
                    </span>
                  ) : null}
                </dt>
                <dd className="text-gray-700">
                  {discount ? "-€18.00 (50%)" : "€0.00"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Shipping</dt>
                <dd className="text-gray-700">€5.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">
                  €{discount ? "23.00" : "37.00"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}