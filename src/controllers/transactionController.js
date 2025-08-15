import supabase from "../config/supabaseClient.js";
export const calculateAndSaveDailyPrices = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];
        const { items, employee_ids } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ" });
        }


        let results = [];
        let grandTotal = 0;

        for (let item of items) {
            const { bank_id, quantity, note } = item;

            const { data: bankPrice } = await supabase
                .from("bank_prices")
                .select("price")
                .eq("bank_id", bank_id)
                .eq("date", today)
                .maybeSingle();

            const price = Number(bankPrice?.price || 0);
            const qty = Number(quantity) || 0;
            const total_amount = qty * price;

            await supabase.from("transactions").insert([{
                bank_id,
                date: today,
                quantity: qty,
                price,
                total_amount,
                note: note || null
            }]);

            results.push({ bank_id, date: today, quantity: qty, price, total_amount });
            grandTotal += total_amount;
        }

        // ====== TRỪ LƯƠNG NHÂN VIÊN ======
        if (Array.isArray(employee_ids) && employee_ids.length > 0) {
            const { data: salaries } = await supabase
                .from("employee_expenses")
                .select("employee_id, amount")
                .eq("date", today)
                .in("employee_id", employee_ids);

            const salaryTotal = salaries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
            grandTotal -= salaryTotal; // trừ vào tổng

            // Lưu log hoặc bảng riêng nếu muốn
        }

        // ====== LƯU DAILY TOTAL ======
        await supabase
            .from("daily_totals")
            .upsert([{ date: today, total_amount: grandTotal }], { onConflict: "date" });

        return res.status(200).json({
            message: "Tính giá & lưu thành công",
            grand_total: grandTotal,
            data: results
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi server" });
    }
};


export const getAllTotalDaily = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("daily_totals")
            .select("*")
            .order("date", { ascending: false });

        if (error) {
            return res.status(500).json({ error: "Lỗi lấy tổng tiền hàng ngày" });
        }

        return res.status(200).json({
            message: "Lấy tổng tiền hàng ngày thành công",
            data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi server" });
    }
}

export const getMonthlyIncome = async (req, res) => {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            .toISOString()
            .split("T")[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            .toISOString()
            .split("T")[0];

        const { data, error } = await supabase
            .from("daily_totals")
            .select("*")
            .gte("date", firstDay)
            .lte("date", lastDay)
            .order("date", { ascending: true });

        if (error) {
            return res.status(500).json({ error: "Lỗi lấy thống kê thu nhập tháng" });
        }

        return res.status(200).json({
            message: "Lấy thống kê thu nhập tháng thành công",
            data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Lỗi server" });
    }
};
