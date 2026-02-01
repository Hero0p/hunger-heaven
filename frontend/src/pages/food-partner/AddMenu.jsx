import React from 'react';
import MenuForm from '../../components/menu/MenuForm';
import BottomNav from '../../components/BottomNav'; // Assuming similar layout needs

const AddMenu = () => {
    return (
        <div style={{ paddingBottom: '70px', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ padding: '16px 20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Partner Dashboard</h1>
            </header>

            <main style={{ padding: '0 20px' }}>
                <MenuForm />
            </main>

            <BottomNav />
        </div>
    );
};

export default AddMenu;
