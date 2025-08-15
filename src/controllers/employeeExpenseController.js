import supabase from "../config/supabaseClient.js";
// Thêm khoản chi cho nhân viên
export const addExpense = async (req, res) => {
    const { employee_id, date, amount, note } = req.body;
    const expenseDate = date || new Date().toISOString().split('T')[0]; // Mặc định hôm nay

    if (!employee_id || !amount) {
        return res.status(400).json({ error: 'Thiếu employee_id hoặc amount' });
    }

    // Kiểm tra nhân viên tồn tại
    const { data: emp, error: empError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', employee_id)
        .single();

    if (empError || !emp) {
        return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }

    // Upsert khoản chi (nếu tồn tại thì update)
    const { data, error } = await supabase
        .from('employee_expenses')
        .upsert(
            [{ employee_id, date: expenseDate, amount, note }],
            { onConflict: ['employee_id', 'date'] } // Điều kiện xác định trùng
        )
        .select('*, employees(name)');

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Lưu khoản chi thành công', record: data[0] });
};


// Lấy danh sách chi phí nhân viên
export const getExpenses = async (req, res) => {
    const { from, to } = req.query;
    let query = supabase
        .from('employee_expenses')
        .select('id, date, amount, note, employees(name, position)')
        .order('date', { ascending: false });

    if (from) query = query.gte('date', from);
    if (to) query = query.lte('date', to);

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
};

export const getMonthlyEmployeeExpenses = async (req, res) => {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];

        const { data, error } = await supabase
            .from("employee_expenses")
            .select("date, amount")
            .gte("date", firstDay)
            .lte("date", lastDay)
            .order("date", { ascending: true });

        if (error) {
            return res.status(500).json({ error: "Lỗi lấy thống kê chi phí nhân viên tháng" });
        }

        // Gộp tổng chi phí theo ngày
        const totalsByDate = {};
        data.forEach(item => {
            const date = item.date;
            if (!totalsByDate[date]) totalsByDate[date] = 0;
            totalsByDate[date] += Number(item.amount || 0);
        });

        const formatted = Object.keys(totalsByDate).map(date => ({
            date,
            total_amount: totalsByDate[date]
        }));

        return res.status(200).json({
            message: "Lấy thống kê chi phí nhân viên tháng thành công",
            data: formatted
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi server" });
    }
};
