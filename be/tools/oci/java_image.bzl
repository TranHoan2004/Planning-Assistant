"java_img macros for OCI containers"

load("@aspect_bazel_lib//lib:tar.bzl", "tar")
load("@aspect_bazel_lib//lib:transitions.bzl", "platform_transition_filegroup")
load("@rules_oci//oci:defs.bzl", "oci_image", "oci_load")

def java_img(name, jar_name, exposed_ports, base = "@distroless_java", tag = "latest", **kwargs):
    tar(
        name = name + "_app_layer",
        srcs = [jar_name],
    )
    oci_image(
        name = name,
        base = base,
        tars = [
            name + "_app_layer",
        ],
        cmd = ["/" + native.package_name() + "/{}".format(jar_name)],
        exposed_ports = exposed_ports,
    )
    oci_load(
        name = name + ".load",
        image = name,
        repo_tags = [
            native.package_name() + ":" + tag,
        ],
        **kwargs
    )
