import nodemailer from "nodemailer";

// Email configuration use fake SMTP for now
// To check emails go to https://ethereal.email/ and login with credentials below
// I know it's not secure to have credentials in code, but this is just for this demo
const createTransporter = () => {
	return nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false,
		auth: {
			user: "trace.torp@ethereal.email",
			pass: "W7bG2hhDSDQrrmsZhm",
		},
	});
};

interface OverdueNotificationData {
	userName: string;
	userEmail: string;
	courses: {
		title: string;
		dueDate: string;
		daysOverdue: number;
	}[];
}

export class EmailService {
	private transporter = createTransporter();

	async sendOverdueNotification(data: OverdueNotificationData) {
		const { userName, userEmail, courses } = data;

		const coursesList = courses
			.map(
				(course) =>
					`• ${course.title} (${course.daysOverdue} days overdue, due: ${course.dueDate})`,
			)
			.join("\n");

		const mailOptions = {
			from: "noreply@niftylearning.com",
			to: userEmail,
			subject: "Overdue Courses",
			text: `Hi ${userName},

	You have ${courses.length} overdue course(s):

	${coursesList}

	Please complete these courses ASAP.

	Nifty Learning Team`,
		};

		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error("Error sending email:", error);
		}
	}
}

export const emailService = new EmailService();
