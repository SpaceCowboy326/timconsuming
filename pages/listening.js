import Head from 'next/head'
import Link from 'next/link'
import Layout from './components/layout'

export default function Drinking() {


    return (<Layout selectedPage={'listening'}>
            <div>This is what I listens to.</div>
    </Layout>);
}