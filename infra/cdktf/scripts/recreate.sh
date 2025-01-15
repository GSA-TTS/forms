#!/bin/bash
#
# Rebuild the Docassemble Lightsail instance.
# This script assumes that cdktf.out has previously been populated;
# if it hasn't, do: `pnpm cdktf synth` first.
#

pushd cdktf.out/stacks/10x-forms-dev
terraform taint aws_lightsail_instance.docassemble_lightsail
popd
pnpm cdktf deploy
