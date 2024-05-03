"use client";
import { useState, useCallback } from "react";
import {
  Description,
  Field,
  FieldGroup,
  Label,
} from "@/components/catalyst/fieldset";
import { Input } from "@/components/catalyst/input";
import { Button } from "@/components/catalyst/button";
import { useRouter } from "next/navigation";
import {
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/catalyst/dialog";
import { Select } from "@/components/catalyst/select";

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
    (event) => {
      // To prevent the form from redirecting the page
      event.preventDefault();
      


      router.push("/verify/upload-selfie");
    },
    [router]
  );

  return (
    <>
      <DialogTitle>About You</DialogTitle>
      <DialogDescription>
        Tell us a bit about yourself. This will help us verify your identity.
      </DialogDescription>
      <DialogBody>
        <form>
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
              <Description>We currently only support.</Description>
            </Field>
          </FieldGroup>
        </form>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => {}}>
          Cancel
        </Button>
        <Button disabled={!name || !university} onClick={handleSubmit}>
          Next
        </Button>
      </DialogActions>
    </>
  );
}
