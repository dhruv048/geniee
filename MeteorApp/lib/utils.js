
export const NotificationTypes = {
    HOSPITAL_ADD: 1,
    DOCTOR_ADD: 2,
    NEW_ARTICLE: 3,
    LIKE_ARTICLE: 5,
    COMMENT_ARTICLE: 6,
    ANSWER_QUESTION: 4,
    MESSAGE_RECEIVED: 7,
    FOLLOWED: 8,
};

export const userType = {
    VISITOR: 0,
    DOCTOR: 1,
    HOSPITAL: 2,
    CLINIC: 3,
    LAB: 4,
    SUPER_ADMIN: 5,
};

export const padZeros = (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};
export const AppointmentStatus = {
    APPOINTMENT_REQUESTED: 0,
    APPOINTMENT_ACKNOWLEDGED: 1,
    APPOINTMENT_CONFIRMED: 2,
    APPOINTMENT_DECLINE: 3,
    APPOINTMENT_CANCEL_VISITOR: 4,
    APPOINTMENT_CLOSE: 5,
};

export const SubscriptionTypes = {
    PLATINUM: 0,
    GOLD: 1,
    STANDARD: 2,
    FREE: 100,
};

export const Subscriptions = [
    {
        USERTYPE: userType.DOCTOR,
        PLATINUM: {
            TYPE: 0,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 'Unlimited',
            ARTICLES: 'Unlimited',
            REPORTSHARING: 'Unlimited',
            PRIMETAG: true,
            PRICE: 5000
        },
        GOLD: {
            TYPE: 1,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 10,
            ARTICLES: 20,
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            PRICE: 4000
        },
        STANDARD: {
            TYPE: 2,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 5,
            ARTICLES: 10,
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            PRICE: 3000
        }
    },
    {
        USERTYPE: userType.HOSPITAL,
        PLATINUM: {
            TYPE: 0,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 'Unlimited',
            ARTICLES: 'Unlimited',
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: true,
            USERLOGIN: 5,
            PRICE: 40000
        },
        GOLD: {
            TYPE: 1,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 25,
            ARTICLES: 40,
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 3,
            PRICE: 25000
        },
        STANDARD: {
            TYPE: 2,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 10,
            ARTICLES: 10,
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 1,
            PRICE: 15000
        }
    },
    {
        USERTYPE: userType.CLINIC,
        PLATINUM: {
            TYPE: 0,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 'Unlimited',
            ARTICLES: 'Unlimited',
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: true,
            USERLOGIN: 5,
            PRICE: 40000
        },
        GOLD: {
            TYPE: 1,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 25,
            ARTICLES: 40,
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 3,
            PRICE: 25000
        },
        STANDARD: {
            TYPE: 2,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 10,
            ARTICLES: 10,
            DOCTORLISTING: "Unlimited",
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 1,
            PRICE: 15000
        }
    },
    {
        USERTYPE: userType.LAB,
        PLATINUM: {
            TYPE: 0,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 'Unlimited',
            ARTICLES: 'Unlimited',
            REPORTSHARING: 'Unlimited',
            PRIMETAG: true,
            USERLOGIN: 5,
            PRICE: 40000
        },
        GOLD: {
            TYPE: 1,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 25,
            ARTICLES: 40,
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 3,
            PRICE: 25000
        },
        STANDARD: {
            TYPE: 2,
            APPOINTMENTS: 'Unlimited',
            VIDEOUPLOADS: 10,
            ARTICLES: 10,
            REPORTSHARING: 'Unlimited',
            PRIMETAG: false,
            USERLOGIN: 1,
            PRICE: 15000
        }
    }
];

export const getTimeSlots = (start, end, duration, breakTime) => {
    console.log(start, end, duration, breakTime);
    var startTime = new moment(start, 'HH:mm');
    var endTime = new moment(end, 'HH:mm');
    var timeSlots = [];
    while (startTime <= endTime) {
        var from = new moment(startTime).format('HH:mm');
        startTime.add(duration, 'minutes');
        var to = new moment(startTime).format('HH:mm');
        console.log()
        if (startTime.isBefore(endTime))
            timeSlots.push({from: from, to: to, isBooked: false});
        startTime.add(breakTime, 'minutes');


    }
    return timeSlots;
}



