"use client";
import { db } from "@/lib/firebaseConfig";
import { Table, Rate } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (value: string, record: any) => {
      return <a href={`/arenas/${record.id}`}>{value}</a>;
    },
  },
  { title: "City", dataIndex: "city" },
  { title: "11v11", dataIndex: "full" },
  { title: "7v7", dataIndex: "seven" },
  { title: "Rooms", dataIndex: "rooms" },
  { title: "Access", dataIndex: "access" },
  {
    title: "Rating",
    dataIndex: "rating",
    render: (value: number) => <Rate disabled value={value} />,
  },
];
export default function ArenasTable() {
  const [loading, setLoading] = useState(false);
  const [arenaData, setArenaData] = useState([]);
  useEffect(() => {
    const getArenas = async () => {
      setLoading(true);
      const arenasRef = collection(db, "arenas");
      const snapshot = await getDocs(arenasRef);
      const data: any = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArenaData(data);
      setLoading(false);
    };
    getArenas();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <section className="p-4 bg-[#0B0F19] min-h-screen">
      <Table
        columns={columns}
        dataSource={arenaData}
        className="custom-dark-table"
        bordered={false}
      />
    </section>
  );
}
