//importing modules
//const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

const createDonor = async (req, res) => {
    try {
        //add joi validations
        console.log({ req: req?.body?.phone });
        const { rows } = await db.client.query(
            'select donor_id from donor where phone = $1', [req?.body?.phone]
        );
        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Donor already exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'insert into donor (first_name,last_name,gender,blood_type,country,state,city,locality,phone,email,dob,created_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',
            [body?.fName, body?.lName, body?.gender, body?.bloodType, body?.country, body?.state, body?.city, body?.locality, body?.phone, body?.email, body?.dob, body?.createdAt]
        );

        return res.status(400).send({ type: 'success', message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const updateDonor = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );
        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }
        const body = req?.body;
        const { result } = await db.client.query(
            'update donor set first_name=$1,last_name=$2,gender=$3,blood_type=$4,country=$5,state=$6,city=$7,locality=$8,email=$10,dob=$11,created_at=$12 where donor_id = $13',
            [body?.fName, body?.lName, body?.gender, body?.bloodType, body?.country, body?.state, body?.city, body?.locality, body?.email, body?.dob, body?.createdAt, donor_id]
        );

        return res.status(400).send({ type: 'success', message: "User Updated Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const deleteDonor = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const d_details = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );
        if (d_details?.rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }

        const { rows } = await db.client.query(
            'select * from blood_bag where donor_id = $1 limit 1', [donor_id]
        );

        if (rows?.length > 0) {
            return res.status(400).send({ type: 'error', message: 'Donor Cannot be deleted' });
        }

        await db.client.query(
            'delete from donor where donor_id = $1', [donor_id]
        );

        return res.status(400).send({ type: 'success', message: "User Deleted Successfully" });
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
                case "country":
                    filters?.country?.length > 0 ? toReturn += `country ilike '${filters?.country}' and ` : null;
                    break;
                case "dob":
                    filters?.dob?.length > 0 ? toReturn += `dob >= '${filters?.dob}' and ` : null;
                    break;
                case "phone":
                    filters?.phone?.length > 0 ? toReturn += `phone ilike '${filters?.phone}' and ` : null;
                    break;
                case "email":
                    filters?.email?.length > 0 ? toReturn += `email ilike '${filters?.email}' and ` : null;
                    break;
                case "createdAt":
                    filters?.createdAt?.length > 0 ? toReturn += `created_at >= '${filters?.createdAt}' and ` : null;
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

const getDonors = async (req, res) => {
    try {
        //add joi validations
        const body = req?.body;
        const { rows } = await db.client.query(
            `select * from donor ${buildWhere(body?.filters)} order by donor_id desc`
        );

        return res.status(400).send({ type: 'success', message: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}

const getDonorDetails = async (req, res) => {
    try {
        //add joi validations

        const donor_id = req.params['donor_id'];
        if (!donor_id) {
            return res.status(400).send({ type: 'error', message: 'Donor Id is Required' });
        }

        const { rows } = await db.client.query(
            'select * from donor where donor_id = $1', [donor_id]
        );

        if (rows?.length == 0) {
            return res.status(400).send({ type: 'error', message: 'Donor does not exists' });
        }

        const donations = await db.client.query(
            'select * from blood_bag where donor_id = $1', [donor_id]
        );

        const donatedTo = await db.client.query(
            'select p.hospital_id ,p.first_name ,p.last_name ,p.gender ,p.dob ,p.received_at ,p.received_quantity_ml,p.pid from blood_bag bb inner join patient p on bb.bag_id = p.blood_bag_id where bb.donor_id=$1', [donor_id]
        );

        let toReturn = {
            ...rows[0],
            donations: donations?.rows || [],
            donatedTo: donatedTo?.rows || [],
        };

        return res.status(400).send({ type: 'success', message: toReturn });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ type: 'error', message: 'Something Went Wrong!' });
    }
}



module.exports = {
    createDonor,
    updateDonor,
    deleteDonor,
    getDonors,
    getDonorDetails
}