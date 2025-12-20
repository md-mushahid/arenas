"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, Table, Spin, Statistic, Row, Col, Button, Dropdown, Modal, Descriptions, Tag, message } from "antd";
import { DollarOutlined, CalendarOutlined, UserOutlined, ClockCircleOutlined, EllipsisOutlined, EyeOutlined, MailOutlined, CreditCardOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuthState } from "@/hooks/useAuthState";
import AppSidebar from "@/components/layout/AppSidebar";

interface Booking {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    start_time: string;
    end_time: string;
    amount: number;
    total_booking_hours: number;
    status: string;
    paidAt: string | null;
    payment_intent: string;
}

export default function ArenaBookingsPage() {
    const { id: arenaId } = useParams();
    const { user } = useAuthState();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [arena, setArena] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [error, setError] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!arenaId || Array.isArray(arenaId) || !user) return;

            try {
                setLoading(true);
                setError("");

                const token = await user.getIdToken();
                const response = await fetch(`/api/arena/bookings?arenaId=${arenaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch bookings");
                }

                const data = await response.json();
                setBookings(data.bookings);
                setTotalEarnings(data.totalEarnings);
                setArena(data.arena);
            } catch (error: any) {
                console.error("Error fetching bookings:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [arenaId, user]);

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setDetailsModalOpen(true);
    };

    const handleContactUser = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    const handleCancelBooking = async (booking: Booking) => {
        Modal.confirm({
            title: "Cancel Booking",
            content: (
                <div>
                    <p>Are you sure you want to cancel this booking?</p>
                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <p><strong>User:</strong> {booking.user_name}</p>
                        <p><strong>Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
                        <p><strong>Amount:</strong> ${(booking.amount / 100).toFixed(2)}</p>
                    </div>
                    <p className="mt-3 text-red-600 text-sm">
                        ⚠️ This will permanently delete the booking from the system.
                    </p>
                </div>
            ),
            okText: "Yes, Cancel Booking",
            okType: "danger",
            cancelText: "No, Keep It",
            onOk: async () => {
                try {
                    setCancellingId(booking.id);
                    const token = await user?.getIdToken();

                    const response = await fetch("/api/arena/bookings/cancel", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            orderId: booking.id,
                            arenaId: arenaId,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || "Failed to cancel booking");
                    }

                    message.success("Booking cancelled successfully");

                    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
                    setTotalEarnings((prev) => prev - booking.amount);
                } catch (error: any) {
                    console.error("Error cancelling booking:", error);
                    message.error(error.message || "Failed to cancel booking");
                } finally {
                    setCancellingId(null);
                }
            },
        });
    };

    const columns = [
        {
            title: "Booked By",
            dataIndex: "user_name",
            key: "user_name",
            render: (name: string, record: Booking) => (
                <div>
                    <div className="flex items-center gap-2">
                        <UserOutlined className="text-blue-500" />
                        <span className="font-medium">{name}</span>
                    </div>
                    <div className="text-xs text-gray-500">{record.user_email}</div>
                </div>
            ),
        },
        {
            title: "Start Time",
            dataIndex: "start_time",
            key: "start_time",
            render: (time: string) => (
                <div className="flex items-center gap-2">
                    <CalendarOutlined className="text-green-500" />
                    {new Date(time).toLocaleString()}
                </div>
            ),
        },
        {
            title: "End Time",
            dataIndex: "end_time",
            key: "end_time",
            render: (time: string) => new Date(time).toLocaleString(),
        },
        {
            title: "Duration",
            dataIndex: "total_booking_hours",
            key: "total_booking_hours",
            render: (hours: number) => (
                <div className="flex items-center gap-2">
                    <ClockCircleOutlined className="text-orange-500" />
                    {hours} hour{hours !== 1 ? "s" : ""}
                </div>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => (
                <div className="flex items-center gap-2 font-semibold text-green-600">
                    <DollarOutlined />
                    ${(amount / 100).toFixed(2)}
                </div>
            ),
        },
        {
            title: "Paid At",
            dataIndex: "paidAt",
            key: "paidAt",
            render: (paidAt: string | null) =>
                paidAt ? new Date(paidAt).toLocaleString() : "N/A",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Booking) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "view",
                                label: "View Details",
                                icon: <EyeOutlined />,
                                onClick: () => handleViewDetails(record),
                            },
                            {
                                key: "contact",
                                label: "Contact User",
                                icon: <MailOutlined />,
                                onClick: () => handleContactUser(record.user_email),
                            },
                            {
                                key: "payment",
                                label: "Payment Info",
                                icon: <CreditCardOutlined />,
                                onClick: () => {
                                    Modal.info({
                                        title: "Payment Information",
                                        content: (
                                            <div className="space-y-2">
                                                <p><strong>Payment Intent:</strong> {record.payment_intent}</p>
                                                <p><strong>Amount:</strong> ${(record.amount / 100).toFixed(2)}</p>
                                                <p><strong>Status:</strong> <Tag color="success">Paid</Tag></p>
                                            </div>
                                        ),
                                    });
                                },
                            },
                            {
                                type: "divider",
                            },
                            {
                                key: "cancel",
                                label: "Cancel Booking",
                                icon: <DeleteOutlined />,
                                danger: true,
                                onClick: () => handleCancelBooking(record),
                            },
                        ],
                    }}
                    trigger={["click"]}
                >
                    <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#0a0e13] items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-[#0a0e13] text-white">
                <AppSidebar />
                <main className="flex-1 p-6 flex items-center justify-center">
                    <Card className="glass-panel border-0 max-w-md">
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
                            <p className="text-gray-400">{error}</p>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[#0a0e13] text-white">
            <AppSidebar />

            <main className="flex-1 p-6 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{arena?.name || "Arena"} - Bookings</h1>
                        <p className="text-gray-400">View all bookings and earnings for this arena</p>
                    </div>

                    <Row gutter={[16, 16]} className="mb-6">
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="glass-panel border-0">
                                <Statistic
                                    title={<span className="text-gray-400">Total Bookings</span>}
                                    value={bookings.length}
                                    prefix={<CalendarOutlined className="text-blue-500" />}
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="glass-panel border-0">
                                <Statistic
                                    title={<span className="text-gray-400">Total Earnings</span>}
                                    value={(totalEarnings / 100).toFixed(2)}
                                    prefix={<DollarOutlined className="text-green-500" />}
                                    valueStyle={{ color: "#10b981" }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card className="glass-panel border-0">
                                <Statistic
                                    title={<span className="text-gray-400">Total Hours Booked</span>}
                                    value={bookings.reduce((sum, b) => sum + b.total_booking_hours, 0)}
                                    suffix="hrs"
                                    prefix={<ClockCircleOutlined className="text-orange-500" />}
                                    valueStyle={{ color: "#fff" }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Card className="glass-panel border-0">
                        <Table
                            columns={columns}
                            dataSource={bookings}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                            className="custom-table"
                            locale={{ emptyText: "No bookings yet" }}
                        />
                    </Card>
                </div>

                {/* Booking Details Modal */}
                <Modal
                    title="Booking Details"
                    open={detailsModalOpen}
                    onCancel={() => setDetailsModalOpen(false)}
                    footer={[
                        <Button key="close" onClick={() => setDetailsModalOpen(false)}>
                            Close
                        </Button>,
                        <Button
                            key="contact"
                            type="primary"
                            icon={<MailOutlined />}
                            onClick={() => {
                                if (selectedBooking) {
                                    handleContactUser(selectedBooking.user_email);
                                }
                            }}
                        >
                            Contact User
                        </Button>,
                    ]}
                    width={600}
                >
                    {selectedBooking && (
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Booked By">
                                <div className="flex items-center gap-2">
                                    <UserOutlined />
                                    {selectedBooking.user_name}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {selectedBooking.user_email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Time">
                                {new Date(selectedBooking.start_time).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="End Time">
                                {new Date(selectedBooking.end_time).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Duration">
                                {selectedBooking.total_booking_hours} hour{selectedBooking.total_booking_hours !== 1 ? "s" : ""}
                            </Descriptions.Item>
                            <Descriptions.Item label="Amount">
                                <span className="text-green-600 font-semibold">
                                    ${(selectedBooking.amount / 100).toFixed(2)}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Tag color="success">Paid</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Intent">
                                {selectedBooking.payment_intent}
                            </Descriptions.Item>
                            <Descriptions.Item label="Paid At">
                                {selectedBooking.paidAt
                                    ? new Date(selectedBooking.paidAt).toLocaleString()
                                    : "N/A"}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Modal>
            </main>
        </div>
    );
}
