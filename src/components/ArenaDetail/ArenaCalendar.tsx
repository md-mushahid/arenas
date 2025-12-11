import { useState } from "react";

export default function PitchScheduler() {
  // Facility types
  const facilities = [
    { id: "11v11", name: "11v11 Pitch", color: "blue" },
    { id: "7v7", name: "7v7 Pitch", color: "green" },
    { id: "5v5", name: "5v5 Pitch", color: "purple" },
    { id: "meeting", name: "Meeting Room", color: "orange" },
    { id: "gym", name: "Gym", color: "red" },
    { id: "trainer", name: "Trainer", color: "pink" },
  ];

  // Active facility
  const [activeFacility, setActiveFacility] = useState("11v11");

  // Settings
  const minBookingHours = 1;
  const maxBookingHours = 4;

  // Dummy booked slots for different facilities
  const allBookedSlots = {
    "11v11": [
      { day: 1, startHour: 14, endHour: 16, user: "Team A" },
      { day: 3, startHour: 10, endHour: 12, user: "Team B" },
    ],
    "7v7": [
      { day: 2, startHour: 15, endHour: 17, user: "Youth Team" },
      { day: 4, startHour: 9, endHour: 11, user: "Training Group" },
    ],
    "5v5": [
      { day: 1, startHour: 18, endHour: 20, user: "Corporate Event" },
    ],
    "meeting": [
      { day: 2, startHour: 10, endHour: 11, user: "Board Meeting" },
      { day: 3, startHour: 14, endHour: 15, user: "Staff Meeting" },
    ],
    "gym": [
      { day: 1, startHour: 8, endHour: 10, user: "Personal Training" },
      { day: 5, startHour: 16, endHour: 18, user: "Fitness Class" },
    ],
    "trainer": [
      { day: 2, startHour: 11, endHour: 13, user: "Session with John" },
      { day: 4, startHour: 15, endHour: 17, user: "Session with Sarah" },
    ],
  };

  // Dummy disabled slots for different facilities
  const allDisabledSlots = {
    "11v11": [{ day: 6, startHour: 18, endHour: 22 }],
    "7v7": [{ day: 0, startHour: 8, endHour: 12 }],
    "5v5": [],
    "meeting": [{ day: 6, startHour: 8, endHour: 22 }, { day: 0, startHour: 8, endHour: 22 }],
    "gym": [],
    "trainer": [{ day: 0, startHour: 8, endHour: 22 }],
  };

  // User selections (separate for each facility)
  const [allSelectedSlots, setAllSelectedSlots] = useState({
    "11v11": [],
    "7v7": [],
    "5v5": [],
    "meeting": [],
    "gym": [],
    "trainer": [],
  });

  // Get current facility data
  const bookedSlots = allBookedSlots[activeFacility] || [];
  const disabledSlots = allDisabledSlots[activeFacility] || [];
  const selectedSlots = allSelectedSlots[activeFacility] || [];

  // Week navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  });

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(currentWeekStart);
    day.setDate(currentWeekStart.getDate() + i);
    weekDays.push(day);
  }

  // Navigation functions
  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  const goToToday = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    setCurrentWeekStart(weekStart);
  };

  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  // Check slot status
  const getSlotStatus = (dayIndex, hour) => {
    const bookedSlot = bookedSlots.find(
      s => s.day === dayIndex && hour >= s.startHour && hour < s.endHour
    );
    const disabledSlot = disabledSlots.find(
      s => s.day === dayIndex && hour >= s.startHour && hour < s.endHour
    );
    const selectedSlot = selectedSlots.find(
      s => s.day === dayIndex && hour >= s.startHour && hour < s.endHour
    );
    
    if (bookedSlot) return { type: "booked", slot: bookedSlot };
    if (disabledSlot) return { type: "disabled" };
    if (selectedSlot) return { type: "selected", slot: selectedSlot };
    return { type: "available" };
  };

  // Handle slot click
  const handleSlotClick = (dayIndex, hour) => {
    const status = getSlotStatus(dayIndex, hour);
    
    if (status.type === "booked" || status.type === "disabled") {
      return;
    }

    if (status.type === "selected") {
      // Remove selection
      const updated = selectedSlots.filter(s => !(s.day === dayIndex && s.startHour === hour));
      setAllSelectedSlots({ ...allSelectedSlots, [activeFacility]: updated });
      return;
    }

    // Add new selection
    const newSlot = {
      day: dayIndex,
      startHour: hour,
      endHour: hour + 1,
    };

    setAllSelectedSlots({ 
      ...allSelectedSlots, 
      [activeFacility]: [...selectedSlots, newSlot] 
    });
  };

  // Confirm booking
  const confirmBooking = () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    const totalHours = selectedSlots.reduce((sum, s) => sum + (s.endHour - s.startHour), 0);
    
    if (totalHours < minBookingHours) {
      alert(`Minimum booking is ${minBookingHours} hour(s)`);
      return;
    }
    
    if (totalHours > maxBookingHours) {
      alert(`Maximum booking is ${maxBookingHours} hour(s)`);
      return;
    }

    const facilityName = facilities.find(f => f.id === activeFacility)?.name;
    alert(`Booking confirmed for ${facilityName}! ${totalHours} hour(s) selected.`);
    setAllSelectedSlots({ ...allSelectedSlots, [activeFacility]: [] });
  };

  // Clear selection
  const clearSelection = () => {
    setAllSelectedSlots({ ...allSelectedSlots, [activeFacility]: [] });
  };

  // Get color classes based on facility
  const getColorClasses = (type) => {
    const currentFacility = facilities.find(f => f.id === activeFacility);
    const color = currentFacility?.color || "blue";
    
    const colorMap = {
      blue: { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-700", hover: "hover:bg-blue-200" },
      green: { bg: "bg-green-100", border: "border-green-500", text: "text-green-700", hover: "hover:bg-green-200" },
      purple: { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-700", hover: "hover:bg-purple-200" },
      orange: { bg: "bg-orange-100", border: "border-orange-500", text: "text-orange-700", hover: "hover:bg-orange-200" },
      red: { bg: "bg-red-100", border: "border-red-500", text: "text-red-700", hover: "hover:bg-red-200" },
      pink: { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-700", hover: "hover:bg-pink-200" },
    };
    
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Facility Booking System
          </h1>
          <p className="text-gray-600">
            Select a facility and choose available time slots
          </p>
        </div>

        {/* Facility Tabs */}
        <div className="bg-white rounded-lg shadow mb-4 p-2">
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility) => {
              const isActive = activeFacility === facility.id;
              const colorMap = {
                blue: "bg-blue-600",
                green: "bg-green-600",
                purple: "bg-purple-600",
                orange: "bg-orange-600",
                red: "bg-red-600",
                pink: "bg-pink-600",
              };
              
              return (
                <button
                  key={facility.id}
                  onClick={() => setActiveFacility(facility.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    isActive
                      ? `${colorMap[facility.color]} text-white`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {facility.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Info */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {facilities.find(f => f.id === activeFacility)?.name}
              </h2>
              <p className="text-sm text-gray-600">
                Min: {minBookingHours}h | Max: {maxBookingHours}h per booking
              </p>
            </div>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 ${colors.bg} border-2 ${colors.border} rounded`}></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Week Navigation */}
          <div className="bg-gray-100 border-b p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousWeek}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
              >
                ← Previous Week
              </button>
              
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <p className="text-sm text-gray-600">
                  {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <button
                  onClick={goToToday}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go to Today
                </button>
              </div>
              
              <button
                onClick={goToNextWeek}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700"
              >
                Next Week →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left text-sm font-semibold border-b border-r">Time</th>
                  {weekDays.map((day, i) => (
                    <th key={i} className="p-3 text-center text-sm font-semibold border-b">
                      <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-bold">{day.getDate()}</div>
                      <div className="text-xs text-gray-500">
                        {day.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour}>
                    <td className="p-3 text-sm text-gray-600 border-r border-b bg-gray-50 font-medium">
                      {hour % 12 || 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                    </td>
                    {weekDays.map((_, dayIndex) => {
                      const status = getSlotStatus(dayIndex, hour);
                      
                      let className = "p-3 border-b text-center cursor-pointer hover:bg-gray-50 transition";
                      let content = null;

                      if (status.type === "booked") {
                        className = "p-3 border-b text-center bg-red-50 border-l-4 border-l-red-500 cursor-not-allowed";
                        if (status.slot && status.slot.startHour === hour) {
                          content = (
                            <div className="text-xs font-medium text-red-700">
                              {status.slot.user}
                            </div>
                          );
                        }
                      } else if (status.type === "disabled") {
                        className = "p-3 border-b text-center bg-gray-200 cursor-not-allowed";
                        content = <div className="text-xs text-gray-500">Closed</div>;
                      } else if (status.type === "selected") {
                        className = `p-3 border-b text-center ${colors.bg} border-l-4 ${colors.border} cursor-pointer ${colors.hover}`;
                        content = (
                          <div className={`text-xs font-medium ${colors.text}`}>
                            Selected ✓
                          </div>
                        );
                      }

                      return (
                        <td
                          key={dayIndex}
                          className={className}
                          onClick={() => handleSlotClick(dayIndex, hour)}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Summary */}
        {selectedSlots.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Your Selection</h3>
            <p className="text-gray-600 mb-4">
              {selectedSlots.length} slot(s) selected • Total: {selectedSlots.reduce((sum : number, s : { endHour : number, startHour : number}) => sum + (s.endHour - s.startHour), 0)} hour(s)
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmBooking}
                className={`px-6 py-2 ${getColorClasses().bg.replace('100', '600')} text-white rounded-lg font-semibold hover:opacity-90 transition`}
              >
                Confirm Booking
              </button>
              <button
                onClick={clearSelection}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}