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
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createSession } from "@/lib/api";

const universities = [
  "Universitat Politècnica de Catalunya",
  "Danmarks Tekniske Universitet",
  "École Centrale de Lille",
];

export default function FillDetails() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Save the details to the database
      createSession(name, university)
        .catch((error) => {
          console.error(error);
          throw error;
        })
        .then((sessionId) => {
          router.push(`/verify/upload-selfie/${sessionId}`);
        });
    },
    [name, university, router]
  );

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>About You</DialogTitle>
      <DialogDescription>
        Tell us a bit about yourself. This will help us verify your identity.
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
              {universities.map((university) => (
                <option key={university}>{university}</option>
              ))}
            </Select>
            <Description>
              We currently only support the best universities in the world.
            </Description>
          </Field>
        </FieldGroup>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => {}}>
          Cancel
        </Button>
        <Button disabled={!name || !university} type="submit">
          Next
        </Button>
      </DialogActions>
    </form>
  );
}
