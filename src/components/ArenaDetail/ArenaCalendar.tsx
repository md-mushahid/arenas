"use client";

import { useState } from "react";
import { Button, Tag, Tooltip } from "antd";
import { Calendar, momentLocalizer, SlotInfo, Event as CalendarEvent } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useArenaBooking from "@/hooks/useAreanaBooking";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const { handleBooking, events, selectedSlots, setSelectedSlots } = useArenaBooking();
  const [date, setDate] = useState(new Date());

  // Dynamic min/max time per day (3 PM - 9 PM)
  const getMinMax = (currentDate: Date) => {
    const minTime = new Date(currentDate);
    minTime.setHours(15, 0, 0);
    const maxTime = new Date(currentDate);
    maxTime.setHours(21, 0, 0);
    return { minTime, maxTime };
  };

  const { minTime, maxTime } = getMinMax(date);

  // Check if slot is in the past
  const isPastSlot = (slot: SlotInfo | { start: Date; end: Date }) => slot.end < new Date();

  // Handle selecting a slot
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (isPastSlot(slotInfo)) return;

    // Check overlap with booked events
    const overlap = events.find(
      (e) => slotInfo.start < e.end && slotInfo.end > e.start
    );

    // Check if slot already selected
    const alreadySelected = selectedSlots.find(
      (s) => slotInfo.start.getTime() === s.start.getTime() && slotInfo.end.getTime() === s.end.getTime()
    );

    if (alreadySelected) {
      setSelectedSlots(selectedSlots.filter(
        (s) => s.start.getTime() !== slotInfo.start.getTime() || s.end.getTime() !== slotInfo.end.getTime()
      ));
    } else if (!overlap) {
      setSelectedSlots([...selectedSlots, slotInfo]);
    }
  };

  // Clear all selected slots
  const clearSelection = () => setSelectedSlots([]);

  // Styling for slots
  const slotPropGetter = (dateSlot: Date) => {
    // Selected slots
    const selected = selectedSlots.find(
      (s) => dateSlot >= s.start && dateSlot < s.end
    );
    if (selected) return { style: { backgroundColor: "#1677ff", color: "#fff" } };

    // Booked slots
    const booked = events.find(
      (e) => dateSlot >= e.start && dateSlot < e.end
    );
    if (booked) return { style: { backgroundColor: "#f5222d", color: "#fff", pointerEvents: "none" } };

    // Past slots
    if (dateSlot < new Date()) return { style: { backgroundColor: "#d9d9d9", color: "#888", pointerEvents: "none" } };

    return {};
  };

  // Event styling
  const eventPropGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: "#f5222d",
      color: "#fff",
      borderRadius: 4,
      padding: "2px",
      cursor: "not-allowed",
    },
  });

  // Event tooltip
  const eventRenderer = (event: CalendarEvent) => (
    <Tooltip title={event.description}>
      <span>{event.title}</span>
    </Tooltip>
  );

  return (
    <div style={{ padding: 20, backgroundColor: "#1f1f1f", minHeight: "100vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        date={date}
        onNavigate={setDate}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, backgroundColor: "#fff", borderRadius: 8, padding: 10 }}
        min={minTime}
        max={maxTime}
        selectable
        popup={false}
        views={["week"]}
        defaultView="week"
        onSelectSlot={handleSelectSlot}
        slotPropGetter={slotPropGetter}
        eventPropGetter={eventPropGetter}
        step={60}
        timeslots={1}
        components={{ event: eventRenderer }}
      />

      {/* Selected Slots */}
      {selectedSlots.length > 0 && (
        <div style={{ marginTop: 16, color: "#fff" }}>
          <h3>Selected Slots</h3>
          {selectedSlots.map((s, idx) => (
            <Tag key={idx} color="gold">
              {moment(s.start).format("ddd, MMM D, h:mm A")} → {moment(s.end).format("h:mm A")}
            </Tag>
          ))}
          <div style={{ marginTop: 10 }}>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              onClick={() => handleBooking(selectedSlots)} // ✅ Send selected slots to hook
            >
              Proceed to Checkout
            </Button>
            <Button danger onClick={clearSelection}>Clear Selection</Button>
          </div>
        </div>
      )}
    </div>
  );
}
