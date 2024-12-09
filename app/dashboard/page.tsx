"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Strategy Builder</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visual Strategy Builder</CardTitle>
            <CardDescription>
              Create strategies using our visual drag-and-drop interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/builder">
              <Button>Launch Visual Builder</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Strategy Builder</CardTitle>
            <CardDescription>
              Create strategies by describing them to our AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/chat">
              <Button>Launch AI Builder</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
