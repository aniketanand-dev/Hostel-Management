module.exports = {
    SUPER_ADMIN: [
        { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
        { name: "Payments", path: "/payments", icon: "payment" },
        { name: "Complaints", path: "/complaints", icon: "complaint" },
        { name: "Food Management", path: "/food", icon: "food" },
        { name: "Student Management", path: "/students", icon: "students" },
        { name: "Staff Management", path: "/staff", icon: "staff" },
        { name: "Attendance", path: "/attendance", icon: "attendance" },
        { name: "Reports", path: "/reports", icon: "reports" },
        { name: "Notices", path: "/notices", icon: "notice" }
    ],
    STUDENT: [
        { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
        { name: "Payments", path: "/payments", icon: "payment" },
        { name: "Complaints", path: "/complaints", icon: "complaint" },
        { name: "Food Menu", path: "/food", icon: "food" },
        { name: "Notices", path: "/notices", icon: "notice" }
    ],
    WARDEN: [
        { name: "Dashboard", path: "/dashboard", icon: "dashboard" },
        { name: "Complaints", path: "/complaints", icon: "complaint" },
        { name: "Attendance", path: "/attendance", icon: "attendance" },
        { name: "Food Oversight", path: "/food-oversight", icon: "food" }
    ],
    CLEANER: [
        { name: "Assigned Tasks", path: "/tasks", icon: "tasks" },
        { name: "Complaints", path: "/complaints", icon: "complaint" },
        { name: "Attendance", path: "/attendance", icon: "attendance" }
    ],
    COOK: [
        { name: "Food Menu", path: "/food", icon: "food" },
        { name: "Complaints", path: "/complaints", icon: "complaint" },
        { name: "Inventory", path: "/inventory", icon: "inventory" }
    ]
};
