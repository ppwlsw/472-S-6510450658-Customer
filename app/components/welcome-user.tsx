const WelcomeUser = ({ userName }: { userName: string }) => {
  return (
    <div
      className="w-full p-5 rounded-xl shadow-lg mb-5"
      style={{
        background: `linear-gradient(135deg, #242F40, #3b4a63)`,
      }}
    >
      <h2 className="text-2xl font-semibold text-white">สวัสดี, {userName}! 🎉</h2>
      <p className="mt-2 text-lg text-white">ยินดีต้อนรับกลับสู่บริการคิวที่คุณชื่นชอบ! เราพร้อมที่จะทำให้เวลารอคอยของคุณน่าสนุกยิ่งขึ้น<span className="ml-1 text-2xl">😆</span></p>
    </div>
  );
};

export default WelcomeUser;
