const message_schedule = [
    { delay: 30 * 60 * 1000,           msg: "1st reminder, 30mins" },
    { delay: 24 * 60 * 60 * 1000,      msg: "2nd reminder, 1 day"  },
    { delay: 3  * 24 * 60 * 60 * 1000, msg: "3rd reminder, 3 days" }
];


const message_schedule_quick = [
    { delay: 2000,  msg: "1st reminder, 2s"  }, 
    { delay: 6000,  msg: "2nd reminder, 6s"  }, 
    { delay: 12000, msg: "3rd reminder, 12s" }
];


export default message_schedule_quick;
