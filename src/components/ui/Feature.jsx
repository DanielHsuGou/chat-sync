import React from "react";
import Typography from "@/components/ui/typography";

const Feature = ({ icon, headline, description }) => {
  return (
    <div
      className="flex flex-col gap-6 text-left max-w-72 md:items-start
        items-center"
    >
      <div className="py-4 px-4 rounded-md border max-w-fit">{icon}</div>
      <Typography variant="h3">{headline}</Typography>
      <Typography variant="p" className="text-minor text-center md:text-left">
        {description}
      </Typography>
    </div>
  );
};

export default Feature;
