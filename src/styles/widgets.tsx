"use client";

import NotificationsWidget from "./NotificationsWidget";
import RemindersWidget from "./RemindersWidget";
import WeatherWidget from "./WeatherWidget";

export default function WidgetsBar() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex w-full justify-center">
        <div className="flex w-full snap-x snap-mandatory items-start justify-center gap-3 overflow-x-auto">
          <div className="shrink-0 snap-center origin-top scale-[0.9]">
            <NotificationsWidget />
          </div>
          <div className="shrink-0 snap-center origin-top scale-[0.9]">
            <WeatherWidget />
          </div>
          <div className="shrink-0 snap-center origin-top scale-[0.9]">
            <RemindersWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
