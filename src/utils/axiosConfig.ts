import axios from "axios";
export const startReqConfig = async () => {
    axios.interceptors.request.use((config:any) => {
        config.headers["startTime"] = process.hrtime();
        return config;
    });

    axios.interceptors.response.use((response) => {
        const start:any = response.config.headers["startTime"];
        const end = process.hrtime(start);
        const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
        response.headers["duration"] = milliseconds.toString();
        response.headers.status = response.status.toString();
        return response;
    });
}