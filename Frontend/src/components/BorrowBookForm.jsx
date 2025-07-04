import { useEffect, useState } from "react";
import axios from "axios";

export default function BorrowBookForm() {
    const [borrowers, setBorrowers] = useState([]);
    const [books, setBooks] = useState([]);

    const [selectedName, setSelectedName] = useState("");
    const [selectedBookId, setSelectedBookId] = useState("");
    const [borrowDate, setBorrowDate] = useState("");
    const [today, setToday] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        // Set hari ini (format YYYY-MM-DD)
        const todayDate = new Date().toISOString().split("T")[0];
        setToday(todayDate);
        setBorrowDate(todayDate);

        // Fetch borrower
        axios.get("http://localhost:8080/borrower")
            .then(res => setBorrowers(res.data.data))
            .catch(() => setErrorMsg("Gagal memuat daftar peminjam"));

        // Fetch books
        axios.get("http://localhost:8080/book")
            .then(res => setBooks(res.data.data))
            .catch(() => setErrorMsg("Gagal memuat daftar buku"));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        if (!selectedName || !selectedBookId || !borrowDate) {
            setErrorMsg("Mohon lengkapi semua field");
            setLoading(false);
            return;
        }

        const matchingBorrowers = borrowers.filter(
            (b) => b.name.toLowerCase() === selectedName.toLowerCase()
        );

        if (matchingBorrowers.length === 0) {
            setErrorMsg("Nama tidak ditemukan. Silakan daftar dulu 🙏");
            setLoading(false);
            return;
        }

        if (matchingBorrowers.length > 1) {
            setErrorMsg("Nama ganda ditemukan. Harap pilih nama lengkap yang unik.");
            setLoading(false);
            return;
        }

        const borrower_id = matchingBorrowers[0]._id;

        const input = {
            borrower_id,
            book_id: selectedBookId,
            borrow_date: borrowDate,
        };

        try {
            const res = await axios.post("http://localhost:8080/borrowing/add", input);
            if (res.data.success) {
                setSuccessMsg("Peminjaman berhasil disimpan! 📚");
                setSelectedName("");
                setSelectedBookId("");
                setBorrowDate(today); // Reset ke hari ini
                setTimeout(() => setSuccessMsg(""), 3000);
            } else {
                setErrorMsg("Gagal menyimpan peminjaman 😢");
            }
        } catch (err) {
            setErrorMsg("Terjadi kesalahan saat menyimpan 😓");
        }

        setLoading(false);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 px-4 py-16">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-2xl font-bold text-center text-purple-700 mb-6 drop-shadow-sm">
                    Borrow Book Form
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Borrower Dropdown */}
                    <select
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                        <option value="">-- Select The Borrower --</option>
                        {[...new Set(borrowers.map(b => b.name))].map((name, idx) => (
                            <option key={idx} value={name}>{name}</option>
                        ))}
                    </select>

                    {/* Book Dropdown */}
                    <select
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                        <option value="">-- Select The Book --</option>
                        {books.map(book => (
                            <option key={book._id} value={book._id}>{book.title}</option>
                        ))}
                    </select>

                    {/* Date Picker */}
                    <input
                        type="date"
                        value={borrowDate}
                        min={today}
                        onChange={(e) => setBorrowDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />

                    {/* Messages */}
                    {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
                    {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-6 text-white font-medium rounded-lg transition-colors duration-300 ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {loading ? "Menyimpan..." : "Submit"}
                    </button>
                </form>
            </div>
        </section>
    );
}
