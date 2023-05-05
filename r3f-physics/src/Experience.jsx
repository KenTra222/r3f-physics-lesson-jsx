import { useState, useRef, useEffect } from 'react'
import { Perf } from 'r3f-perf'
import { OrbitControls, useGLTF } from '@react-three/drei'
import {InstancedRigidBodies, Physics, RigidBody, CuboidCollider, CylinderCollider} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'


export default function Experience()
{
    // model
    const model = useGLTF('../public/hamburger.glb')
    console.log( model)
    const cube = useRef()
    const cubes = useRef()
    const twister = useRef()

    const cubeJump = () => {
        // adds the position movement
        cube.current.applyImpulse({ x: 0, y: 5, z: 0 })

        //adds the rotation of the object
        cube.current.applyTorqueImpulse({ x: 0, y: 1, z: 0 })
    }

    const cubesCount = 3

    useFrame((state) => {
    // gets the time
     const time = state.clock.getElapsedTime()
    

    // creates a euler or a rotation in place. needs the THREE library
     const eulerRotation = new THREE.Euler(0, time, 0)
    const quaternionRotation = new THREE.Quaternion()
    quaternionRotation.setFromEuler(eulerRotation)
    twister.current.setNextKinematicRotation(quaternionRotation)

    //creates movement
    const angle = time * 0.5
    const x = Math.cos(angle) * 2
    const z = Math.sin(angle) * 2
    twister.current.setNextKinematicTranslation({ x: x, y: - 0.8, z: z })
    })

    useEffect(() =>
    {
        for(let i = 0; i < cubesCount; i++)
    {
        const matrix = new THREE.Matrix4()
        matrix.compose(
            new THREE.Vector3(i * 2, 0, 0),
            new THREE.Quaternion(),
            new THREE.Vector3(1, 1, 1)
        )

        cubes.current.setMatrixAt(i, matrix)
    }
    }, [])

    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 0.5 } />

    <Physics debug> 
        
        {/* ball */}
        <RigidBody colliders="ball" refraction={0}>
            <mesh castShadow position={ [ - 2, 2, 0 ] }>
                <sphereGeometry />
                <meshStandardMaterial color="orange" />
            </mesh>
        </RigidBody>

        {/* cube */}

        <RigidBody
             ref={cube}
             restitution={ 0.5 }>

        <mesh  castShadow position={ [ 2, 2, 0 ] }  onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
        </RigidBody>

        {/* twister */}
        <RigidBody
        position={ [ 0, - 0.8, 0 ] }
        friction={ 0 }
        type="kinematicPosition"
        ref={twister}
    >
        <mesh castShadow scale={ [ 0.4, 0.4, 3 ] }>
            <boxGeometry />
            <meshStandardMaterial color="red" />
        </mesh>
    </RigidBody>

    <RigidBody colliders={ "trimesh" } position={ [ 0, 4, 0 ] }>
        <primitive object={model.scene} scale={0.2}/>
        {/* <CylinderCollider args={ [ 0.5, 1.25 ] } /> */}
    </RigidBody>


    <InstancedRigidBodies>
        <instancedMesh ref={ cubes } args={ [ null, null, cubesCount ] }>
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
        </instancedMesh>
    </InstancedRigidBodies>


    {/* walls */}
    <RigidBody type="fixed">
        <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [ 0, 1, 5.5 ] } />
        <CuboidCollider args={ [ 5, 2, 0.5 ] } position={ [ 0, 1, - 5.5 ] } />
        <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [ 5.5, 1, 0 ] } />
        <CuboidCollider args={ [ 0.5, 2, 5 ] } position={ [ - 5.5, 1, 0 ] } />
    </RigidBody>

    {/* floor */}

        <RigidBody type='fixed'
        restitution={ 1 }>
            <mesh receiveShadow position-y={ - 1.25 }>
                <boxGeometry args={ [ 10, 0.5, 10 ] } />
                <meshStandardMaterial color="greenyellow" />
            </mesh>
        </RigidBody>
    </Physics>

    </>
}