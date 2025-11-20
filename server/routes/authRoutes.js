const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"   );
const path = require("path");

const router = express.Router();
const JWT_SECRET = "segredo-super-seguro";

// Usuário temporário (troque depois por banco)
const usuarioFake = {
    id: 1,
    email: "dvybatista@gmail.com",
    senhaHash: bcrypt.hashSync("123456", 10) // senha: 123456
};

// Página de login (frontend)
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/login.html"));
});

// POST para realizar login
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    if (email !== usuarioFake.email) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(senha, usuarioFake.senhaHash);

    if (!senhaValida) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    const token = jwt.sign(
        { id: usuarioFake.id, email: usuarioFake.email },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res
    .cookie("token", token, {
        httpOnly: true,
        secure: false, // coloque true se usar HTTPS
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 // 1 hora
    })
    .json({ msg: "Login realizado!" });
});

router.post('/logout', (req, res) => {
  res.clearCookie("token");
  return res.json({ msg: "Logout realizado com sucesso" });
});

module.exports = router;
