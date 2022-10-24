import mysql from "mysql"

export const db = mysql.createConnection({
    host:"192.168.1.17",
    user:"nodejs",
    password:"node1234",
    database:"sfhs"
})
