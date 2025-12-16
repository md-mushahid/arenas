"use client";

import { useState } from "react";
import { Button, Spin, Tag, Tooltip, message } from "antd";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useArenaBooking from "@/hooks/useAreanaBooking";

const localizer = momentLocalizer(moment);

export default function MyCalendar({ arena }: any) {
  const { events, selectedSlots, setSelectedSlots, handlePay, loading, bookings } =
    useArenaBooking(arena);

  const [date, setDate] = useState(new Date());

  const getMinMax = (currentDate: Date) => {
    const minTime = new Date(currentDate);
    minTime.setHours(15, 0, 0);
    const maxTime = new Date(currentDate);
    maxTime.setHours(21, 0, 0);
    return { minTime, maxTime };
  };

  const { minTime, maxTime } = getMinMax(date);

  const isPastSlot = (slot: SlotInfo) => {
    const now = new Date();
    // Round 'now' up to the start of the next hour
    const nextHour = moment(now).add(1, 'hour').startOf('hour').toDate();

    // Check if the slot starts before the start of the next hour
    return slot.start < nextHour;
  };

  const isOverlappingBooked = (slot: SlotInfo) =>
    events.some((e) => slot.start < e.end && slot.end > e.start);

  /**
   * Checks if the new slot is adjacent (consecutive) to the existing selection.
   * A new slot must be adjacent to the beginning or the end of the current block.
   */
  const isConsecutive = (slots: any[], newSlot: SlotInfo) => {
    if (!slots.length) return true;

    const sorted = [...slots].sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    // Check if new slot is consecutive to the end of the block
    const isConsecutiveToEnd = last.end.getTime() === newSlot.start.getTime();

    // Check if new slot is consecutive to the start of the block
    const isConsecutiveToStart = newSlot.end.getTime() === first.start.getTime();

    return isConsecutiveToEnd || isConsecutiveToStart;
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (isPastSlot(slotInfo)) {
      message.error("You cannot book previous time slots.");
      return;
    }

    if (isOverlappingBooked(slotInfo)) {
      message.error("This slot is already booked.");
      return;
    }

    const alreadySelected = selectedSlots.find(
      (s: any) =>
        s.start.getTime() === slotInfo.start.getTime() &&
        s.end.getTime() === slotInfo.end.getTime()
    );

    if (alreadySelected) {
      // Logic for deselecting an already selected slot
      // NOTE: Deselecting from the middle of a selection could break the consecutive rule for remaining slots.
      // A more complex implementation would ensure the remaining slots are still consecutive.
      setSelectedSlots(
        selectedSlots.filter(
          (s: any) =>
            s.start.getTime() !== slotInfo.start.getTime() ||
            s.end.getTime() !== slotInfo.end.getTime()
        )
      );
      return;
    }

    // Check for consecutiveness when adding a new slot
    if (!isConsecutive(selectedSlots, slotInfo)) {
      message.error("You can only book consecutive time slots (e.g., 5-6, 6-7, or 4-5 if 5-6 is selected).");
      return;
    }

    // Add the new slot and sort to maintain order
    const newSelectedSlots = [...selectedSlots, slotInfo].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
    );
    setSelectedSlots(newSelectedSlots);
  };

  const slotPropGetter = (dateSlot: Date) => {
    // Check if the slot is booked
    const booked = events.find((e) => dateSlot >= e.start && dateSlot < e.end);

    if (booked) {
      return {
        style: {
          backgroundColor: "#f5222d", // Red for booked
          color: "#fff",
          pointerEvents: "none",
        },
      };
    }

    // Check if the slot is selected
    const selected = selectedSlots.find(
      (s: any) => dateSlot >= s.start && dateSlot < s.end
    );

    if (selected) {
      return {
        style: {
          backgroundColor: "#1677ff", // Blue for selected
          color: "#fff",
        },
      };
    }

    return {};
  };

  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#f5222d", // Red for booked event
      color: "#fff",
      cursor: "not-allowed",
    },
  });

  if (loading) return <Spin/>;
  console.log("bookings", bookings);
  return (
    <div style={{ padding: 20 }}>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={setDate}
        startAccessor="start"
        endAccessor="end"
        min={minTime}
        max={maxTime}
        selectable
        views={["week"]}
        defaultView="week"
        step={60}
        timeslots={1}
        onSelectSlot={handleSelectSlot}
        slotPropGetter={slotPropGetter}
        eventPropGetter={eventPropGetter}
        style={{ height: 600, backgroundColor: "#fff" }}
      />

      {selectedSlots.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3>Selected Slots</h3>
          {selectedSlots.map((s, i) => (
            <Tag key={i} color="gold">
              {moment(s.start).format("MMM D, h:mm A")} →{" "}
              {moment(s.end).format("h:mm A")}
            </Tag>
          ))}

          <div style={{ marginTop: 10 }}>
            <Button type="primary" onClick={() => handlePay(selectedSlots)}>
              Proceed to Checkout ({selectedSlots.length} Hour{selectedSlots.length > 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}