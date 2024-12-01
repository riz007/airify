"use client";

import Link from "next/link";

export function ApiCredits() {
  return (
    <footer className="mt-8 text-center">
      <p>
        Data provided by the{" "}
        <Link href="https://www.waqi.info/">World Air Quality Index</Link>{" "}
        Project.
        <br />
        API usage is subject to the{" "}
        <Link href="https://docs.openaq.org/api/">
          OpenAQ API Terms of Service
        </Link>
        .
      </p>{" "}
    </footer>
  );
}
