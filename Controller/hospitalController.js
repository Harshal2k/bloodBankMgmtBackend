//importing modules
//const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const createHospital = async (req, res) => {
    try {
        //add joi validations

        const { rows } = await db.client.query(
            'select hid from hospital where phone = $1', [req?.body?.phone]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital already exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'insert into hospital (hname,phone,email,country,state,city,locality) values ($1,$2,$3,$4,$5,$6,$7)',
            [body?.hname, body?.phone, body?.email, body?.country, body?.state, body?.city, body?.locality]
        );

        return res.status(400).send({ type: 'success', message: "Hospital Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updateHospital = async (req, res) => {
    try {
        //add joi validations

        const bank_id = req.params['bank_id'];
        if (!bank_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bank where blood_bank_id = $1', [bank_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update blood_bank set b_name=$1,email=$2,country=$3,state=$4,city=$5,locality=$6',
            [body?.b_name, body?.email, body?.country, body?.state, body?.city, body?.locality]
        );

        return res.status(400).send({ type: 'success', message: "Hospital Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const deleteHospital = async (req, res) => {
    try {
        //add joi validations

        const bank_id = req.params['bank_id'];
        if (!bank_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bank where blood_bank_id = $1', [bank_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }

        const bags = await db.client.query(
            'select * from blood_bag where bb_id = $1 limit 1', [bank_id]
        );

        const hospital = await db.client.query(
            'select * from hospital_bank_rln where bank_id = $1 limit 1', [bank_id]
        );

        if (bags?.rows?.length > 0 || hospital?.rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital Cannot be deleted' });
        }

        await db.client.query(
            'delete from blood_bank where blood_bank_id = $1', [bank_id]
        );

        return res.status(400).send({ type: 'success', message: "Hospital Deleted Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

function buildWhere(filters) {
    if (Object.keys(filters)?.length > 0) {
        let toReturn = 'where '
        Object.keys(filters)?.forEach((key) => {
            switch (key) {
                case "b_name":
                    filters?.b_name?.length > 0 ? toReturn += `b_name ilike '${filters?.b_name}' and ` : null;
                    break;
                case "country":
                    filters?.country?.length > 0 ? toReturn += `country ilike '${filters?.country}' and ` : null;
                    break;
                case "phone":
                    filters?.phone?.length > 0 ? toReturn += `phone ilike '${filters?.phone}' and ` : null;
                    break;
                case "email":
                    filters?.email?.length > 0 ? toReturn += `email ilike '${filters?.email}' and ` : null;
                    break;
                default:
                    break;
            }
        });
        if (toReturn == 'where ') {
            return;
        } else {
            return toReturn.slice(0, -5);
        }
    } else {
        return;
    }
}

const getHospital = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from blood_bank ${buildWhere(body?.filters)} order by blood_bank_id desc`
        );

        return res.status(400).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getHospitalDetails = async (req, res) => {
    try {
        //add joi validations

        const bank_id = req.params['bank_id'];
        if (!bank_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bank where blood_bank_id = $1', [bank_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }

        const bags = await db.client.query(
            'select * from blood_bag where bb_id = $1', [bank_id]
        );

        const hospitals = await db.client.query(
            'select * from hospital where hid in (select hospital_id from hospital_bank_rln where bank_id=$1) ', [bank_id]
        );

        let toReturn = {
            ...rows[0],
            bags: donations?.rows || [],
            hospitals: donatedTo?.rows || [],
        };

        return res.status(400).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}



module.exports = {
    createHospital,
    updateHospital,
    deleteHospital,
    getHospital,
    getHospitalDetails
}