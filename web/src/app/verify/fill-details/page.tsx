"use client";
import { Button } from "@/components/catalyst/button";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import {
  Description,
  Field,
  FieldGroup,
  Label,
} from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Select } from "@/components/catalyst/select";
import Spinner from "@/components/spinner";
import { createSession } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const universities = {
  "Universitat Politècnica de Catalunya":
    "Universitat Politècnica de Catalunya",
  "Danmarks Tekniske Universitet": "Danmarks Tekniske Universitet",
  "École Centrale de Lille": "centralelille",
};

export default function FillDetails() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setLoading(true);

      try {
        const sessionId = await createSession(name, university);

        if (window.innerWidth > 768) {
          router.push(`/verify/switch-to-phone/${sessionId}`);
        } else {
          router.push(`/verify/upload-selfie/${sessionId}`);
        }
      } finally {
        setLoading(false);
      }
    },
    [name, university, router, setLoading]
  );

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Let&apos;s Get to Know You!</DialogTitle>
      <DialogDescription>
        We&apos;re excited to learn a little about you! Just a few quick details
        to help verify your identity.
      </DialogDescription>
      <DialogBody>
        <FieldGroup>
          <Field>
            <Label>Name</Label>
            <Input type="text" onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field>
            <Label>University</Label>
            <Select
              name="univeristy"
              onChange={(e) => setUniversity(e.target.value)}
            >
              <option value="">Select a university</option>
              {Object.entries(universities).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </Select>
            <Description>
              Choose from some of the world&apos;s top universities!
            </Description>
          </Field>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button plain>Cancel</Button>
        <Button disabled={!name || !university || loading} type="submit">
          {loading ? <Spinner /> : null}
          Let&apos;s Continue!
        </Button>
      </DialogActions>
    </form>
  );
}
