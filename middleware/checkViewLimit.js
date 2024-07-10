const rateLimit = {};
const VIEW_LIMIT = 10; // Giới hạn số lượt xem từ cùng một IP
const TIME_WINDOW = 60 * 1000; // Khoảng thời gian giới hạn (ms)
 const checkViewLimit = (req, res) => {
    const ip = req.ip;

    if (!rateLimit[ip]) {
        rateLimit[ip] = {
            count: 1,
            timestamp: Date.now()
        };
    } else {
        const currentTime = Date.now();
        if (currentTime - rateLimit[ip].timestamp > TIME_WINDOW) {
            rateLimit[ip] = {
                count: 1,
                timestamp: currentTime
            };
        } else {
            rateLimit[ip].count++;
        }
    }

    if (rateLimit[ip].count > VIEW_LIMIT) {
        return false
    }

    return true
};
module.exports = {checkViewLimit};
