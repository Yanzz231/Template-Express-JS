const nodemailer = require("nodemailer");
const chalk = require("chalk");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

const transporter = nodemailer.createTransport({
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_NODEMAILER,
        pass: process.env.PASSWORD_NODEMAILER,
    },
});

const sendMail = async (otp_code, email_sender, type) => {
    const isChangePassword = type === "forget_password";
    const actionUrl = `${process.env.WEBSITE}/verify?email=${email_sender}&type=${isChangePassword ? "forget-password" : "verify"}`;
    const htmlContent = `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333333; text-align: center;">${isChangePassword ? "Reset Password" : "Verifikasi Email Anda"}</h1>
                <p style="color: #555555; text-align: center;">${isChangePassword ? "Klik tombol di bawah ini untuk reset password Anda" : "Klik tombol di bawah ini untuk memverifikasi email Anda."}</p>
                <a href="${actionUrl}" style="display: block; text-align: center; background-color: #ffcc00; color: #ffffff; font-size: 16px; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Verifikasi Email</a>
                <p style="text-align: center; color: #555555;">Kode OTP Anda: <b>${otp_code}</b></p>
            </div>
        </body>
    </html>`;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_NODEMAILER,
            to: email_sender,
            subject: isChangePassword ? "Reset Password" : "Verifikasi email kamu yuk!",
            text: `Your OTP code is: ${otp_code}`,
            html: htmlContent,
        });
        console.log(chalk.greenBright(`Berhasil mengirim email ke ${email_sender}`));
        return { status: true, message: `Berhasil mengirim email ke ${email_sender}` };
    } catch (err) {
        console.error(chalk.redBright(`Gagal mengirim email ke ${email_sender}: ${err.message}`));
        return { status: false, message: err.message };
    }
};

const findUnique = async (data) => prisma.user.findUnique({ where: data });
const findMany = async (data) => prisma.user.findMany({ where: data });
const generateRandom4Digit = () => Math.floor(1000 + Math.random() * 9000);

const checkAndExpireOtp = async (otpField, reminderField, logMessage) => {
    try {
        const currentTime = new Date();
        const usersWithExpiredReminder = await prisma.user.findMany({
            where: {
                [reminderField]: { lte: currentTime },
                [otpField]: { not: null },
            },
        });

        if (usersWithExpiredReminder.length) {
            console.log(chalk.redBright(`Found ${usersWithExpiredReminder.length} users with expired ${logMessage}`));
            await Promise.all(usersWithExpiredReminder.map(async (user) => {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { [otpField]: null, [reminderField]: null },
                });
                console.log(chalk.redBright(`${logMessage} expired for user ${user.username}`));
            }));
        } else {
            console.log(chalk.redBright(`No users with expired ${logMessage} reminders`));
        }
    } catch (err) {
        console.error(chalk.redBright(`Error checking ${logMessage} reminders:`, err));
    }
};

module.exports = {
    func: {
        sendMail,
        findUnique,
        findMany,
        generateRandom4Digit,
        checkAndExpireOtp,
    },
};
