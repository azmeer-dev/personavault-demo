"use client";
import { useState } from "react";
import  Form  from "next/form";
import { createIdentity } from "./actions";

// Define Account type inline
type Account = {
  id: string;
  provider: string;
  providerAccountId: string;
};

export default function NewIdentityForm({ accounts }: { accounts: Account[] }) {
  const [type, setType] = useState("");

  return (
    <Form action={createIdentity} className="space-y-6 max-w-xl">
      {/* Identity Type */}
      <div>
        <label className="block font-medium mb-1">
          Identity Type <span className="text-red-500">*</span>
        </label>
        <input
          name="type"
          list="identity-types-list"
          placeholder="Select or type identity type"
          className="w-full p-2 border rounded-lg"
          required
          onChange={(e) => setType(e.target.value)}
        />
        <datalist id="identity-types-list">
          <optgroup label="Contextual / Social">
            <option value="Personal" />
            <option value="Professional" />
            <option value="Family" />
            <option value="Education" />
            <option value="Community" />
            <option value="Creative" />
            <option value="Health & Wellness" />
            <option value="Travel" />
            <option value="Legal" />
          </optgroup>
          <optgroup label="Digital / Account-Grouping">
            <option value="Communication" />
            <option value="SocialMedia" />
            <option value="Messaging" />
            <option value="Productivity" />
            <option value="Development" />
            <option value="Finance" />
            <option value="Shopping" />
            <option value="Entertainment" />
            <option value="HealthcarePortal" />
            <option value="GovernmentService" />
            <option value="Utility" />
            <option value="IoT" />
          </optgroup>
        </datalist>
      </div>

      {/* Name */}
      <div>
        <label className="block font-medium mb-1">
          Identity Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          placeholder="Friendly name for this identity"
          className="w-full p-2 border rounded-lg"
          required
        />
      </div>

      {/* Type-specific fields */}
      {type === "Personal" && (
        <>
          <div>
            <label className="block font-medium mb-1">Previous Names</label>
            <input
              name="previousNames"
              placeholder="Comma-separated previous names"
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Religious Names</label>
            <input
              name="religiousNames"
              placeholder="Comma-separated religious names"
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </>
      )}

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          name="description"
          placeholder="Optional details…"
          className="w-full p-2 border rounded-lg"
          rows={3}
        />
      </div>

      {/* Linked Accounts */}
      <div>
        <label className="block font-medium mb-1">Link Existing Accounts</label>
        <select
          name="accountIds"
          multiple
          className="w-full p-2 border rounded-lg"
          size={Math.min(6, accounts.length || 1)}
        >
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.provider} ({acc.providerAccountId})
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Hold ⌘ (macOS) or Ctrl (Windows) to select multiple.
        </p>
      </div>

      {/* Visibility */}
      <div>
        <span className="block font-medium mb-1">Visibility</span>
        <label className="inline-flex items-center mr-4">
          <input type="radio" name="visibility" value="PUBLIC" className="mr-2" /> Public
        </label>
        <label className="inline-flex items-center">
          <input type="radio" name="visibility" value="PRIVATE" defaultChecked className="mr-2" /> Private
        </label>
      </div>

      {/* Submit */}
      <button type="submit" className="button">Create Identity</button>
    </Form>
  );
}
