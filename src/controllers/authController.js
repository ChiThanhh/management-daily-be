import supabase from "../config/supabaseClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//đăng ký
export const register = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        //check email có tồn tại
        const { data: exitstingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        if (exitstingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //thêm người dùng
        const { data, error } = await supabase
            .from("users")
            .insert({
                email,
                password: hashedPassword
            })
            .select("*");

        if (error) {
            return res.status(500).json({ error: "Error creating user" });
        }

        return res.status(201).json({
            message: "User created successfully",
            user: data[0]
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

//đăng nhập

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        //so sánh mật khẩu
        const ifMatch = await bcrypt.compare(password, user.password);
        if (!ifMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        //tạo token
        const token = jwt.sign(
            { id: user.id, email },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}