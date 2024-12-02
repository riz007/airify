"use client";

import Link from "next/link";

export function ApiCredits() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background p-4 text-center border-t">
      <p className="text-sm text-muted-foreground">
        Data provided by the{" "}
        <Link
          href="https://www.waqi.info/"
          className="underline hover:text-primary">
          World Air Quality Index
        </Link>{" "}
        Project.
        <br />
        API usage is subject to the{" "}
        <Link
          href="https://aqicn.org/api/"
          className="underline hover:text-primary">
          World Air Quality Index API Terms of Service
        </Link>
        .
        <br />
        <Link
          href="https://www.flaticon.com/free-icons/air-pollution"
          title="air pollution icons"
          className="underline hover:text-primary">
          Air pollution icons created by Freepik - Flaticon
        </Link>
        .
      </p>
    </footer>
  );
}
