import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import md5 from 'md5';
import cookieConfig from '@/constants/serverSideCookie';
import MongoDB from '@/database';
import { web3 } from '@/utils/factory.js';


const db = new MongoDB({ dbName: 'bepdpp' });
const session = ironSession(cookieConfig);
const handler = nextConnect();

db.connect();
handler.use(db.middleware).use(session);

handler.post(async (req, res) => {
    const { account, password } = req.body;
    const bias = '^vfbvbtadso!mpy';

    const doc = await req.db.collection('account').findOne({
        account: md5(md5(account + bias))
    });

    if (doc && md5(md5(password + bias)) === doc.password) {
        const balance = await web3.eth.getBalance(account, 'latest');
        let balanceWei = web3.utils.fromWei(balance.toString(), 'ether').toString();
        balanceWei = parseFloat(balanceWei).toFixed(2);

        req.session.set('user', { account, balance: balanceWei });
        await req.session.save();
        return res.status(201).end();
    }

    return res.status(403).end();
});

handler.delete(async (req, res) => {
    await req.session.destroy('user');
    return res.status(201).end();
});

handler.patch(async (req, res) => {
    const { condition, update } = req.body;
    const bias = '^vfbvbtadso!mpy';
    condition['account'] && (condition['account'] = md5(md5(condition['account'] + bias)));
    update['publicKey'] && (update['publicKey'] = md5(md5(update['publicKey'] + bias)));

    await req.db.collection('account')
        .updateOne(condition, { 
            $set: update 
        });

    req.session.set('user', {
        publicKey: update.publicKey,
        ...req.session.get('user')
    });
    await req.session.save();

    return res.status(201).end();
});

export default handler;