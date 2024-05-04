import { CheckIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
const steps = [
  { name: "Step 1", href: "#", status: "complete" },
  { name: "Step 2", href: "#", status: "complete" },
  { name: "Step 3", href: "#", status: "current" },
  { name: "Step 4", href: "#", status: "upcoming" },
  { name: "Step 5", href: "#", status: "upcoming" },
];

export default function Example() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={clsx(
              stepIdx !== steps.length - 1 ? "pr-6 sm:pr-20" : "",
              "relative"
            )}
          >
            {step.status === "complete" ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-zinc-600" />
                </div>
                <a
                  href="#"
                  className="relative flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 hover:bg-zinc-900"
                >
                  <CheckIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : step.status === "current" ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-600 bg-white"
                  aria-current="step"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-zinc-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <a
                  href="#"
                  className="group relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400"
                >
                  <span
                    className="h-2 w-2 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
