import Image from "next/image";
import React from "react";
import { Card } from "../../components/card";

export default function Mainpage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-4xl mb-12">Now Playing</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-16 w-fit">
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
        <Card path="/tes.jpg" title="Sonic the hedgedog" desc="12+" />
      </div>
    </div>
  );
};
