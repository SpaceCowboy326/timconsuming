import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'

export default function Drinking() {


    return (<Layout selectedPage={'eating'}>
            <div>This is what I eats.</div>
    </Layout>);
}