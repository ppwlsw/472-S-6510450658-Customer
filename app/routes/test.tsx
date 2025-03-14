import { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState(null);  // สำหรับเก็บข้อมูลที่ได้รับจาก API
  const [loading, setLoading] = useState(true);  // ใช้เพื่อแสดงสถานะการโหลด
  const [error, setError] = useState(null);  // ใช้เพื่อจัดการกับข้อผิดพลาด

  useEffect(() => {
    // ส่ง request ไปที่ /api/origin
    fetch("http://192.168.1.3/api/test/origin")
      .then((response) => {
        if (!response.ok) {
          // ตรวจสอบว่าการตอบกลับเป็น OK หรือไม่ (200-299)
          throw new Error("Network response was not ok");
        }
        return response.json(); // แปลงข้อมูลเป็น JSON
      })
      .then((data) => {
        setData(data);  // ตั้งค่าข้อมูลที่ได้รับ
        setLoading(false);  // ปิดสถานะการโหลด
      })
      .catch((error) => {
        setError(error.message);  // เก็บข้อผิดพลาดที่เกิดขึ้น
        setLoading(false);  // ปิดสถานะการโหลด
      });
  }, []);  // [] เพื่อให้ effect ทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  // จัดการสถานะต่างๆ
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
