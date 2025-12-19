"use client";

import { CSSProperties, useState } from "react";
import { Button, Spin, message, Card } from "antd";
import {
  Calendar,
  momentLocalizer,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useArenaBooking from "@/hooks/useAreanaBooking";
import { ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined } from "@ant-design/icons";

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
    const nextHour = moment(now).add(1, 'hour').startOf('hour').toDate();
    return slot.start < nextHour;
  };

  const isOverlappingBooked = (slot: SlotInfo) =>
    events.some((e) => slot.start < e.end && slot.end > e.start);

  const isConsecutive = (slots: any[], newSlot: SlotInfo) => {
    if (!slots.length) return true;
    const sorted = [...slots].sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const isConsecutiveToEnd = last.end.getTime() === newSlot.start.getTime();
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
      setSelectedSlots(
        selectedSlots.filter(
          (s: any) =>
            s.start.getTime() !== slotInfo.start.getTime() ||
            s.end.getTime() !== slotInfo.end.getTime()
        )
      );
      return;
    }
    if (!isConsecutive(selectedSlots, slotInfo)) {
      message.error("You can only book consecutive time slots (e.g., 5-6, 6-7, or 4-5 if 5-6 is selected).");
      return;
    }
    const newSelectedSlots = [...selectedSlots, slotInfo].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
    );
    setSelectedSlots(newSelectedSlots);
  };

  const slotPropGetter = (dateSlot: Date) => {
    const booked = events.find((e) => dateSlot >= e.start && dateSlot < e.end);
    if (booked) {
      return {
        className: "rbc-event-disabled",
        style: {
          backgroundColor: "rgba(220, 38, 38, 0.1)", // Red with opacity
          cursor: "not-allowed",
          border: 'none'
        } as CSSProperties,
      };
    }
    const selected = selectedSlots.find(
      (s: any) => dateSlot >= s.start && dateSlot < s.end
    );
    if (selected) {
      return {
        style: {
          backgroundColor: "#3b82f6", // Primary blue
          color: "#fff",
          border: '1px solid #2563eb'
        } as CSSProperties,
      };
    }
    return {
      style: {
        backgroundColor: 'transparent',
      } as CSSProperties,
    };
  };

  const eventPropGetter = () => ({
    style: {
      backgroundColor: "#10b981", // Success green for booked/confirmed
      color: "#fff",
      cursor: "not-allowed",
      border: "none",
    },
  });

  if (loading) return (
    <div className="flex justify-center items-center h-96">
        <Spin size="large" />
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[800px]">
      {/* Calendar Section */}
      <Card className="flex-1 border-0 bg-[#111620] h-full flex flex-col" bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="p-4 md:p-6 flex-1 flex flex-col h-full">
             <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <CalendarOutlined className="text-blue-500"/> Availability
                </h3>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-gray-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-gray-400">Booked</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#1f2937] border border-gray-700"></span>
                        <span className="text-gray-400">Available</span>
                    </div>
                </div>
             </div>
             
             <div className="flex-1 min-h-0">
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
                    className="custom-calendar h-full"
                />
             </div>
          </div>
      </Card>
      {selectedSlots.length > 0 && (
        <div className="w-full xl:w-72 shrink-0 animate-slide-in-right">
            <Card className="border border-blue-500/30 bg-blue-500/5 h-full flex flex-col">
               <div className="flex flex-col h-full">
                   <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2 shrink-0">
                       <CheckCircleOutlined className="text-blue-500" /> Selected ({selectedSlots.length})
                   </h4>
                   
                   <div className="flex-1 overflow-y-auto mb-3 pr-1 custom-scrollbar max-h-[400px] xl:max-h-full">
                       <div className="flex flex-col gap-2">
                            {selectedSlots.map((s, i) => (
                                <div key={i} className="w-full py-2 px-3 text-xs border border-blue-500/20 bg-blue-500/10 text-blue-100 rounded-lg flex flex-col gap-1">
                                    <div className="flex items-center gap-2 font-medium">
                                        <ClockCircleOutlined className="text-blue-400"/>
                                        <span>{moment(s.start).format("MMM D")}</span>
                                    </div>
                                    <div className="pl-5 opacity-80">
                                        {moment(s.start).format("h:mm A")} - {moment(s.end).format("h:mm A")}
                                    </div>
                                </div>
                            ))}
                       </div>
                   </div>
                   
                   <div className="shrink-0 pt-3 border-t border-blue-500/20">
                        <div className="flex justify-between items-center mb-3 text-gray-300 text-sm">
                             <span>Total:</span>
                             <span className="font-semibold text-white">
                                {selectedSlots.reduce((acc, slot) => acc + (slot.end.getTime() - slot.start.getTime()) / (1000 * 60 * 60), 0)} hrs
                             </span>
                        </div>
                        <Button 
                            type="primary" 
                            block
                            onClick={() => handlePay(selectedSlots)}
                            className="font-semibold shadow-lg shadow-blue-500/20"
                        >
                            Checkout
                        </Button>
                   </div>
               </div>
            </Card>
        </div>
      )}
    </div>
  );
}