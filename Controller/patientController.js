//importing modules
//const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const createPatient = async (req, res) => {
    try {
        //add joi validations

        const body = req?.body;

        if (!body?.bagId) {
            return res.status(400).send({ type: 'error', message: 'Blood Bag Id is required' });
        } else if (!body?.hospital_id) {
            return res.status(400).send({ type: 'error', message: 'Hospital Id is required' });
        }

        const bloodBag = await db.client.query(
            'select * from blood_bag where bag_id = $1 limit 1', [body?.bagId]
        );

        if (bloodBag?.rowCount == 0) {
            return res.status(400).send({ type: 'error', message: 'Blood Bag does not exists' });
        }

        const hospital = await db.client.query(
            'select * from hospital where hid = $1 limit 1', [body?.hospital_id]
        );

        if (hospital?.rowCount == 0) {
            return res.status(400).send({ type: 'error', message: 'Hospital does not exists' });
        }
        db.client.query('BEGIN');
        const { result } = await db.client.query(
            'insert into patient (first_name,last_name,gender,blood_type,dob,received_quantity_ml,received_at,blood_bag_id,hospital_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
            [body?.fName, body?.lName, body?.gender, body?.bloodType, body?.dob, body?.received_quantity, body?.receivedAt, body?.bagId, body?.hospital_id]
        );

        await db.client.query(
            'update blood_bag set remaining_ml = $1 where bag_id = $2',
            [body.bagId, Number(bloodBag?.remaining_ml) - Number(body?.received_quantity)]
        );
        db.client.query('COMMIT');
        return res.status(400).send({ type: 'success', message: "Patient Created Successfully" });
    } catch (error) {
        db.client.query('ROLLBACK');
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updatePatient = async (req, res) => {
    try {
        //add joi validations

        const pid = req.params['pid'];
        if (!pid) {
            return res.status(400).send({ type: 'error', message: 'Patient Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from patient where pid = $1', [pid]
        );
        
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Patient does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update patient set first_name=$1,last_name=$2,dob=$3 where pid = $4',
            [body?.fName, body?.lName, body?.dob, pid]
        );

        return res.status(400).send({ type: 'success', message: "Patient Updated Successfully" });
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
                case "fName":
                    filters?.fName?.length > 0 ? toReturn += `first_name ilike '${filters?.fName}' and ` : null;
                    break;
                case "lName":
                    filters?.lName?.length > 0 ? toReturn += `last_name ilike '${filters?.lName}' and ` : null;
                    break;
                case "gender":
                    filters?.gender?.length > 0 ? toReturn += `gender = '${filters?.gender}' and ` : null;
                    break;
                case "bloodType":
                    filters?.bloodType?.length > 0 ? toReturn += `blood_type = '${filters?.bloodType}' and ` : null;
                    break;
                case "hospital_id":
                    filters?.hospital_id?.length > 0 ? toReturn += `hospital_id = '${filters?.hospital_id}' and ` : null;
                    break;
                case "dob":
                    filters?.dob?.length > 0 ? toReturn += `dob >= '${filters?.dob}' and ` : null;
                    break;
                case "received_at":
                    filters?.received_at?.length > 0 ? toReturn += `received_at >= '${filters?.received_at}' and ` : null;
                    break;
                case "received_quantity_ml":
                    filters?.received_quantity_ml?.length > 0 ? toReturn += `received_quantity_ml >= '${filters?.received_quantity_ml}' and ` : null;
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

const getPatients = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from patient ${buildWhere(body?.filters)} order by pid desc`
        );

        return res.status(400).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getPatientDetails = async (req, res) => {
    try {
        //add joi validations

        const pid = req.params['pid'];
        if (!pid) {
            return res.status(400).send({ type: 'error', message: 'Patient Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from patient where pid = $1', [pid]
        );
        
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Patient does not exists' });
        }

        const donatedBy = await db.client.query(
            'select * from blood_bag bb inner join donor d on bb.donor_id = d.donor_id where bb.bag_id =1select * from blood_bag where donor_id = $1', [rows[0]?.blood_bag_id]
        );

        const hospital = await db.client.query(
            'select * from hospital where hid = $1', [rows[0]?.hospital_id]
        );

        let toReturn = {
            ...rows[0],
            donatedBy: donatedBy?.rows[0] || [],
            hospital: hospital?.rows[0] || [],
        };

        return res.status(400).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}



module.exports = {
    createPatient,
    updatePatient,
    getPatients,
    getPatientDetails
}